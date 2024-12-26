import { Body, Controller, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RegisterTokenDto } from './dto/register-token.dto';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { MODULES, PERMISSIONS } from '../auth/role';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get('find')
    @ApiOperation({ summary: 'Get users' })
    @ApiResponse({ status: 200, description: 'Get user list' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.users, PERMISSIONS.list)
    async getUsers(
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<UserDto>> {
        return this.usersService.getUsers(paginationDto)
    }

    @Post('create')
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: 201, description: 'User created' })
    @ApiResponse({ status: 400, description: 'Invalid request' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.users, PERMISSIONS.add)
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        return this.usersService.createUser({ dto })
    }

    @Get('pick/:id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiParam({ name: 'id', required: true, description: 'User id' })
    @ApiResponse({ status: 200, description: 'User detail' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.users, PERMISSIONS.detail)
    async pickUser(@Param('id') id: string): Promise<UserDto> {
        return this.usersService.getUserById({ id })
    }

    @Put('update/:id')
    @ApiOperation({ summary: 'Update user' })
    @ApiParam({ name: 'id', required: true, description: 'User id' })
    @ApiResponse({ status: 201, description: 'User updated' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.users, PERMISSIONS.edit)
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<void> {
        return this.usersService.updateUser({ id, dto })
    }

    @Post('profile-picture')
    @ApiOperation({ summary: 'Upload user profile image' })
    @ApiResponse({ status: 200, description: 'User image uploaded' })
    @UseInterceptors(FileInterceptor('file'))
    @CheckPermissions(MODULES.users, PERMISSIONS.edit)
    async uploadProfilePicture(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 10000000 })],
            }),
        ) file: Express.Multer.File,
        @GetUser() user: User
    ) {
        return await this.usersService.uploadProfileImage(file, user.id)
    }

    @Post('register-token')
    @ApiOperation({ summary: 'Register device token' })
    @ApiResponse({ status: 200, description: 'Device token registered' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.users, PERMISSIONS.add)
    async registerToken(
        @GetUser() user: User, @Body() dto: RegisterTokenDto
    ): Promise<void> {
        return await this.usersService.registerDeviceToken({ token: dto.token, id: user.id })
    }

    @Post('soft-delete')
    @ApiOperation({ summary: 'Soft delete user' })
    @ApiResponse({ status: 200, description: 'User soft deleted' })
    @ApiResponse({ status: 500, description: 'Server error' })
    async softDeleteUser(@GetUser() user: User): Promise<void> {
        return await this.usersService.softDeleteUser({ id: user.id })
    }

}
