import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpService } from './otp.service';
import { CommonModule } from '../../common/common.module';

@Module({
    imports: [
        // UserEntity will be added here later
        TypeOrmModule.forFeature([UserEntity]),
        CommonModule,
    ],
    controllers: [UserController],
    providers: [UserService, OtpService],
    exports: [UserService, OtpService],
})
export class UserModule { }
