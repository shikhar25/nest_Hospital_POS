import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    IsDateString,
    MaxLength,
    IsOptional,
    IsEnum,
    IsNumber,
    IsArray,
} from 'class-validator';
import {
    Gender,
    BloodGroup,
    MaritalStatus,
} from '../entities/user.entity';
import { Transform } from 'class-transformer';

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => value.trim())
    first_name: string;

    @IsEmail()
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    @Matches(/^[6-9]\d{9}$/, {
        message: 'Mobile number must be a valid Indian mobile number',
    })
    mobile: string;

    @IsDateString({}, { message: 'DOB must be YYYY-MM-DD' })
    dob: string;
}

export class UpdateUserProfileDto {
    /* ---------- BASIC ---------- */

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => value.trim())
    first_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => value.trim())
    last_name?: string;

    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsEnum(BloodGroup)
    blood_group?: BloodGroup;

    @IsOptional()
    @IsEnum(MaritalStatus)
    marital_status?: MaritalStatus;

    /* ---------- ADDRESS ---------- */

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address_line_1?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address_line_2?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    state?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    pincode?: string;

    /* ---------- MEDICAL ---------- */

    @IsOptional()
    @IsNumber()
    height_cm?: number;

    @IsOptional()
    @IsNumber()
    weight_kg?: number;

    @IsOptional()
    @IsArray()
    allergies?: string[];

    @IsOptional()
    @IsArray()
    chronic_conditions?: string[];

    /* ---------- EMERGENCY ---------- */

    @IsOptional()
    @IsString()
    @MaxLength(100)
    emergency_contact_name?: string;

    @IsOptional()
    @Matches(/^[6-9]\d{9}$/)
    emergency_contact_number?: string;
}
