import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOtpRequestsTable1767349127890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'otp_requests',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'mobile',
                        type: 'varchar',
                        length: '15',
                    },
                    {
                        name: 'otp_type',
                        type: 'enum',
                        enum: ['LOGIN', 'REGISTER', 'RESET'],
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'attempt_count',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('otp_requests');
    }
}
