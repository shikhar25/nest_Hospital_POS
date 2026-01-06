import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpType } from './entities/otp_requests';
import { UpdateUserProfileDto } from './dto/register-user.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly otpService: OtpService,
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterUserDto) {
        const user = await this.userService.register(dto);

        return {
            success: true,
            message: 'User registered successfully. OTP sent for verification.',
            data: {
                uuid: user.uuid,
                patient_code: user.patient_code,
                is_email_verified: user.is_email_verified,
                is_mobile_verified: user.is_mobile_verified,
            },
        };
    }

    @Post('send-mobile-otp')
    async sendMobileOtp(@Body('mobile') mobile: string) {
        await this.otpService.sendMobileOtp(mobile);

        return {
            success: true,
            message: 'OTP sent to mobile number',
        };
    }

    @Post('send-otp')
    async sendOtp(
        @Body('type') type: 'mobile' | 'email',
        @Body('value') value: string,
    ) {
        await this.otpService.sendOtp(type, value);

        return {
            success: true,
            message: `OTP sent to ${type}`,
        };
    }
    @Post('verify-mobile-otp')
    async verifyMobileOtp(
        @Body('mobile') mobile: string,
        @Body('otp') otp: string,
    ) {
        const verified = await this.otpService.verifyOtp(
            mobile,
            'mobile',
            OtpType.LOGIN,
            otp,
        );

        if (!verified) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        await this.userService.markMobileVerified(mobile);

        return {
            success: true,
            message: 'Mobile number verified successfully',
        };
    }

    @Post('verify-otp')
    async verifyOtp(
        @Body('type') type: 'mobile' | 'email',
        @Body('value') value: string,
        @Body('otp') otp: string,
    ) {
        const verified = await this.otpService.verifyOtp(
            value,
            type,
            OtpType.REGISTER,
            otp,
        );

        if (!verified) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        // Find user and update verification status
        const user = await this.userService.findUserByContact(type, value);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (type === 'mobile') {
            await this.userService.markMobileVerified(value);
        } else if (type === 'email') {
            await this.userService.markEmailVerified(value);
        }

        // Store verified user details in Redis
        await this.otpService.storeVerifiedUser(user);

        // Generate JWT
        const jwt = await this.userService.generateJwt(user);
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

        return {
            success: true,
            message: `${type} verified successfully`,
            data: {
                jwt,
                uuid: user.uuid,
                full_name: fullName,
            },
        };
    }

    @Post('registerWithOtp')
    async registerWithOtp(@Body() dto: RegisterUserDto) {
        const result = await this.userService.registerWithOtp(dto);

        return {
            success: true,
            message: 'Registration successful. OTP sent to email and mobile.',
            data: result,
        };
    }

    @Put('profile')
    async updateProfile(
        @Query('uuid') uuid: string,
        @Body() dto: UpdateUserProfileDto,
    ) {
        const user = await this.userService.updateProfile(uuid, dto);

        const full_name = `${user.first_name || ''} ${user.last_name || ''}`.trim();

        return {
            success: true,
            message: 'Profile updated successfully',
            data: {
                uuid: user.uuid,
                user_name: full_name,
                gender: user.gender,
                blood_group: user.blood_group,
                marital_status: user.marital_status,
                updated_at: user.updated_at,
            },
        };
    }

}
