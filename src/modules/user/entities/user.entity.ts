import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from 'typeorm';

export enum AuthProvider {
    LOCAL = 'LOCAL',
    OTP = 'OTP',
    GOOGLE = 'GOOGLE',
    APPLE = 'APPLE',
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export enum MaritalStatus {
    SINGLE = 'SINGLE',
    MARRIED = 'MARRIED',
    OTHER = 'OTHER',
}

export enum BloodGroup {
    A_POS = 'A+',
    A_NEG = 'A-',
    B_POS = 'B+',
    B_NEG = 'B-',
    AB_POS = 'AB+',
    AB_NEG = 'AB-',
    O_POS = 'O+',
    O_NEG = 'O-',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}

export enum CreatedBy {
    SELF = 'SELF',
    ADMIN = 'ADMIN',
}

@Entity('users')
@Unique(['email', 'mobile', 'dob'])
@Unique(['patient_code'])
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'char', length: 36 })
    uuid: string;

    @Index()
    @Column({ length: 50 })
    patient_code: string; // e.g. PT-2026-000123

    /* ---------- AUTH ---------- */

    @Column({ type: 'varchar', length: 255, nullable: true })
    password_hash: string | null;

    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.OTP,
    })
    auth_provider: AuthProvider;

    @Column({ default: false })
    is_email_verified: boolean;

    @Column({ default: false })
    is_mobile_verified: boolean;

    /* ---------- BASIC INFO ---------- */

    @Column({ length: 100 })
    first_name: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    last_name: string | null;

    @Column({ length: 150 })
    email: string;

    @Column({ length: 15 })
    mobile: string;

    @Column({ type: 'date' })
    dob: Date;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender | null;

    @Column({ type: 'enum', enum: BloodGroup, nullable: true })
    blood_group: BloodGroup | null;

    @Column({ type: 'enum', enum: MaritalStatus, nullable: true })
    marital_status: MaritalStatus | null;

    /* ---------- ADDRESS ---------- */

    @Column({ type: 'varchar', length: 255, nullable: true })
    address_line_1: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address_line_2: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    state: string | null;

    @Column({ type: 'varchar', length: 100, default: 'India' })
    country: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    pincode: string | null;

    /* ---------- MEDICAL ---------- */

    @Column({ type: 'float', nullable: true })
    height_cm: number | null;

    @Column({ type: 'float', nullable: true })
    weight_kg: number | null;

    @Column({ type: 'json', nullable: true })
    allergies: string[] | null;

    @Column({ type: 'json', nullable: true })
    chronic_conditions: string[] | null;

    /* ---------- EMERGENCY ---------- */

    @Column({ type: 'varchar', length: 100, nullable: true })
    emergency_contact_name: string | null;

    @Column({ type: 'varchar', length: 15, nullable: true })
    emergency_contact_number: string | null;

    /* ---------- GOVERNMENT / INSURANCE ---------- */

    @Column({ type: 'char', length: 4, nullable: true })
    aadhaar_last4: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    abha_id: string | null; // ABDM

    @Column({ type: 'varchar', length: 100, nullable: true })
    insurance_provider: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    insurance_policy_number: string | null;

    /* ---------- SYSTEM ---------- */

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ type: 'enum', enum: CreatedBy, default: CreatedBy.SELF })
    created_by: CreatedBy;

    @Column({ type: 'timestamp', nullable: true })
    last_login_at: Date | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date | null;
}
