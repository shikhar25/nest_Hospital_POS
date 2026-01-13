import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import redisConfig from './config/redis.config';
import { AppService } from './app.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule.forRoot({
      type: 'single',
      options: redisConfig(),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
