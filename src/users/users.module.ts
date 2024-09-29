import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [AuthModule, TypeOrmModule.forFeature([User])]
})
export class UsersModule { }
