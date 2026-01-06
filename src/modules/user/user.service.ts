import { ConflictException, Injectable, InternalServerErrorException, } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { UserEntity, AuthProvider, CreatedBy } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';

import { NotFoundException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { UpdateUserProfileDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly dataSource: DataSource,
        private readonly otpService: OtpService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterUserDto): Promise<UserEntity> {
        const exists = await this.userRepo.exists({
            where: {
                email: dto.email,
                mobile: dto.mobile,
                dob: new Date(dto.dob),
            },
        });

        if (exists) {
            throw new ConflictException(
                'User already registered with provided details',
            );
        }

        const user = this.userRepo.create({
            uuid: randomUUID(),
            patient_code: this.generatePatientCode(),

            first_name: dto.first_name,
            email: dto.email,
            mobile: dto.mobile,
            dob: new Date(dto.dob),

            auth_provider: AuthProvider.OTP,
            created_by: CreatedBy.SELF,

            is_email_verified: false,
            is_mobile_verified: false,
        });

        return this.userRepo.save(user);
    }

    private generatePatientCode(): string {
        const year = new Date().getFullYear();
        const random = Math.floor(100000 + Math.random() * 900000);
        return `PT-${year}-${random}`;
    }

    async markMobileVerified(mobile: string): Promise<void> {
        const user = await this.userRepo.findOne({
            where: { mobile },
        });

        if (!user) {
            throw new ConflictException('User not found');
        }

        if (user.is_mobile_verified) {
            return; // idempotent
        }

        user.is_mobile_verified = true;
        await this.userRepo.save(user);
    }

    async markEmailVerified(email: string): Promise<void> {
        const user = await this.userRepo.findOne({
            where: { email },
        });

        if (!user) {
            throw new ConflictException('User not found');
        }

        if (user.is_email_verified) {
            return; // idempotent
        }

        user.is_email_verified = true;
        await this.userRepo.save(user);
    }

    async generateJwt(user: UserEntity): Promise<string> {
        const payload = {
            uuid: user.uuid,
            email: user.email,
            mobile: user.mobile,
            sub: user.id,
        };
        return this.jwtService.sign(payload);
    }

    async findUserByContact(type: 'mobile' | 'email', value: string): Promise<UserEntity | null> {
        const where = type === 'mobile' ? { mobile: value } : { email: value };
        return this.userRepo.findOne({ where });
    }

    async updateProfile(
        uuid: string,
        dto: UpdateUserProfileDto,
    ) {
        const user = await this.userRepo.findOne({
            where: { uuid },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.keys(dto).forEach(key => {
            if (dto[key] !== undefined) {
                user[key] = dto[key];
            }
        });

        const updatedUser = await this.userRepo.save(user);

        return updatedUser;
    }

    async registerWithOtp(dto: RegisterUserDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userRepo = queryRunner.manager.getRepository(UserEntity);

            /* 1️⃣ Uniqueness check */
            const exists = await userRepo.exists({
                where: {
                    email: dto.email,
                    mobile: dto.mobile,
                    dob: new Date(dto.dob),
                },
            });

            if (exists) {
                throw new ConflictException(
                    'User already registered with provided details',
                );
            }

            /* 2️⃣ Create user */
            const user = userRepo.create({
                uuid: randomUUID(),
                patient_code: this.generatePatientCode(),

                first_name: dto.first_name,
                email: dto.email,
                mobile: dto.mobile,
                dob: new Date(dto.dob),

                auth_provider: AuthProvider.OTP,
                created_by: CreatedBy.SELF,

                is_email_verified: false,
                is_mobile_verified: false,
            });

            const savedUser = await userRepo.save(user);

            /* 3️⃣ Generate OTPs */
            await this.otpService.sendOtp('mobile', savedUser.mobile);
            await this.otpService.sendOtp('email', savedUser.email);

            /* 4️⃣ Commit transaction */
            await queryRunner.commitTransaction();

            return {
                uuid: savedUser.uuid,
                patient_code: savedUser.patient_code,
            };
        } catch (error) {
            /* 🔥 Rollback DB */
            await queryRunner.rollbackTransaction();

            throw error instanceof ConflictException
                ? error
                : new InternalServerErrorException(
                    'Registration failed. Please try again.',
                );
        } finally {
            await queryRunner.release();
        }
    }
}
