import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
} from 'typeorm';

export class CreateUsersTable1767349123456 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },

                    { name: 'uuid', type: 'char', length: '36', isNullable: false },

                    {
                        name: 'patient_code',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },

                    /* ---------- AUTH ---------- */

                    {
                        name: 'password_hash',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },

                    {
                        name: 'auth_provider',
                        type: 'enum',
                        enum: ['LOCAL', 'OTP', 'GOOGLE', 'APPLE'],
                        default: `'OTP'`,
                    },

                    {
                        name: 'is_email_verified',
                        type: 'boolean',
                        default: false,
                    },

                    {
                        name: 'is_mobile_verified',
                        type: 'boolean',
                        default: false,
                    },

                    /* ---------- BASIC INFO ---------- */

                    {
                        name: 'first_name',
                        type: 'varchar',
                        length: '100',
                    },

                    {
                        name: 'last_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },

                    {
                        name: 'email',
                        type: 'varchar',
                        length: '150',
                    },

                    {
                        name: 'mobile',
                        type: 'varchar',
                        length: '15',
                    },

                    {
                        name: 'dob',
                        type: 'date',
                    },

                    {
                        name: 'gender',
                        type: 'enum',
                        enum: ['MALE', 'FEMALE', 'OTHER'],
                        isNullable: true,
                    },

                    {
                        name: 'blood_group',
                        type: 'enum',
                        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                        isNullable: true,
                    },

                    {
                        name: 'marital_status',
                        type: 'enum',
                        enum: ['SINGLE', 'MARRIED', 'OTHER'],
                        isNullable: true,
                    },

                    /* ---------- ADDRESS ---------- */

                    { name: 'address_line_1', type: 'varchar', length: '255', isNullable: true },
                    { name: 'address_line_2', type: 'varchar', length: '255', isNullable: true },
                    { name: 'city', type: 'varchar', length: '100', isNullable: true },
                    { name: 'state', type: 'varchar', length: '100', isNullable: true },

                    {
                        name: 'country',
                        type: 'varchar',
                        length: '100',
                        default: `'India'`,
                    },

                    { name: 'pincode', type: 'varchar', length: '10', isNullable: true },

                    /* ---------- MEDICAL ---------- */

                    { name: 'height_cm', type: 'float', isNullable: true },
                    { name: 'weight_kg', type: 'float', isNullable: true },

                    {
                        name: 'allergies',
                        type: 'json',
                        isNullable: true,
                    },

                    {
                        name: 'chronic_conditions',
                        type: 'json',
                        isNullable: true,
                    },

                    /* ---------- EMERGENCY ---------- */

                    {
                        name: 'emergency_contact_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },

                    {
                        name: 'emergency_contact_number',
                        type: 'varchar',
                        length: '15',
                        isNullable: true,
                    },

                    /* ---------- GOV / INSURANCE ---------- */

                    {
                        name: 'aadhaar_last4',
                        type: 'char',
                        length: '4',
                        isNullable: true,
                    },

                    {
                        name: 'abha_id',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },

                    {
                        name: 'insurance_provider',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },

                    {
                        name: 'insurance_policy_number',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },

                    /* ---------- SYSTEM ---------- */

                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
                        default: `'ACTIVE'`,
                    },

                    {
                        name: 'created_by',
                        type: 'enum',
                        enum: ['SELF', 'ADMIN'],
                        default: `'SELF'`,
                    },

                    {
                        name: 'last_login_at',
                        type: 'timestamp',
                        isNullable: true,
                    },

                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },

                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },

                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
                uniques: [
                    {
                        columnNames: ['email', 'mobile', 'dob'],
                    },
                    {
                        columnNames: ['patient_code'],
                    },
                ],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_PATIENT_CODE',
                columnNames: ['patient_code'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
