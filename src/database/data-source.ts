import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

// 🔑 Load migration-specific env when running CLI
dotenv.config({
    path: process.env.TYPEORM_ENV === 'migration'
        ? '.env.migration'
        : '.env',
});

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: [
        path.join(__dirname, '/../**/*.entity.{ts,js}'),
    ],

    migrations: [
        path.join(__dirname, '/migrations/*.{ts,js}'),
    ],

    logging: process.env.NODE_ENV === 'development',
    synchronize: false,
});
