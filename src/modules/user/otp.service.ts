import { Injectable, BadRequestException, Get } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { randomInt } from 'crypto';
import { SmsService } from '../../common/services/sms.service';
import { EmailService } from '../../common/services/email.service';
import { OtpType } from './entities/otp_requests';

const redis = new Redis();

async function checkRedis() {
    const keys = await redis.keys('*');
    console.log('Keys:', keys);
    for (const key of keys) {
        const value = await redis.get(key);
        console.log(`${key}: ${value}`);
    }
    redis.disconnect();
}

checkRedis();

@Injectable()
export class OtpService {
    private OTP_TTL_SECONDS = 300; // 5 minutes
    private MAX_ATTEMPTS = 5;

    constructor(
        @InjectRedis() private readonly redis: Redis,
        private readonly smsService: SmsService,
        private readonly emailService: EmailService,
    ) { }

    private getRedisKey(contact: string, contactType: 'mobile' | 'email', type: OtpType): string {
        return `otp:${contactType}:${contact}:${type}`;
    }

    /**
     * Generate & store OTP in Redis
     */
    async generateOtp(contact: string, contactType: 'mobile' | 'email', type: OtpType): Promise<void> {
        const otpCode = randomInt(100000, 999999).toString();

        const key = this.getRedisKey(contact, contactType, type);

        const payload = {
            code: otpCode,
            attempts: 0,
        };

        await this.redis.set(
            key,
            JSON.stringify(payload),
            'EX',
            this.OTP_TTL_SECONDS,
        );

        // Send OTP via appropriate provider
        if (contactType === 'mobile') {
            await this.smsService.sendOtp(contact, otpCode);
        } else {
            await this.emailService.sendOtp(contact, otpCode);
        }
    }

    /**
     * Verify OTP
     */
    async verifyOtp(
        contact: string,
        contactType: 'mobile' | 'email',
        type: OtpType,
        otp: string,
    ): Promise<boolean> {
        const key = this.getRedisKey(contact, contactType, type);

        const data = await this.redis.get(key);

        if (!data) {
            throw new BadRequestException('OTP expired or not found');
        }

        const parsed = JSON.parse(data) as {
            code: string;
            attempts: number;
        };

        if (parsed.attempts >= this.MAX_ATTEMPTS) {
            await this.redis.del(key);
            throw new BadRequestException('Too many invalid attempts');
        }

        if (parsed.code !== otp) {
            parsed.attempts += 1;

            await this.redis.set(
                key,
                JSON.stringify(parsed),
                'KEEPTTL',
            );

            throw new BadRequestException('Invalid OTP');
        }

        // OTP valid → delete
        await this.redis.del(key);
        return true;
    }

    async sendMobileOtp(mobile: string): Promise<void> {
        await this.generateOtp(mobile, 'mobile', OtpType.LOGIN);
    }

    async sendOtp(type: 'mobile' | 'email', value: string): Promise<void> {
        await this.generateOtp(value, type, OtpType.REGISTER);
    }

    // async storeVerifiedUser(user: any): Promise<void> {
    //     const key = `verified_user:${user.uuid}`;

    //     await this.redis.set(
    //         key,
    //         JSON.stringify({
    //             uuid: user.uuid,
    //             first_name: user.first_name,
    //             last_name: user.last_name,
    //             mobile: user.mobile,
    //             verified_at: new Date().toISOString(),
    //         }),
    //         'EX',
    //         600, // 10 minutes
    //     );
    // }

    async storeVerifiedUser(user: any): Promise<void> {

        const key = `verified_user:${user.uuid}`;

        await this.redis.del(key); // safety
        await this.redis.hset(key, {
            uuid: user.uuid,
            first_name: user.first_name,
            last_name: user.last_name ?? '',
            mobile: user.mobile,
            verified_at: new Date().toISOString(),
        });
        await this.redis.expire(key, 600);

        const type = await this.redis.type(key);
        if (type !== 'none' && type !== 'hash') {
            throw new Error(`Redis key ${key} has invalid type: ${type}`);
        }
    }


    @Get('redis-keys')
    async getRedisKeys() {
        const keys = await this.redis.keys('*');
        const data = {};
        for (const key of keys) {
            data[key] = await this.redis.get(key);
        }
        return data;
    }
}
