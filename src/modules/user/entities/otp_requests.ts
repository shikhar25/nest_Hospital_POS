import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';

export enum OtpType {
    LOGIN = 'LOGIN',
    REGISTER = 'REGISTER',
    RESET = 'RESET',
}

@Entity('otp_requests')
@Index(['mobile', 'otp_type'])
export class OtpRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 15 })
    mobile: string;

    @Column({
        type: 'enum',
        enum: OtpType,
    })
    otp_type: OtpType;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ default: 0 })
    attempt_count: number;

    @CreateDateColumn()
    created_at: Date;
}
