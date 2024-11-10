import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { S3Module } from 'src/providers/s3/s3.module';
import { DeviceToken } from './deviceToken.entity';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([User, DeviceToken]),
        S3Module
    ]
})
export class UsersModule { }
