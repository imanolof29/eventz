import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get('find')
    async getUsers(): Promise<UserDto[]> {
        return this.usersService.getUsers()
    }

    @Post('create')
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        return this.usersService.createUser({ dto })
    }

}
