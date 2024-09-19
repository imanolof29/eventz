import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
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

    @Get('pick/:id')
    async pickUser(@Param('id') id: string): Promise<UserDto> {
        return this.usersService.getUserById({ id })
    }

    @Put('update/:id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<void> {
        return this.usersService.updateUser({ id, dto })
    }

}
