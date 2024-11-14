import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { RefreshJwtGuard } from './guards/refresh-auth.guard';
import { User } from 'src/modules/users/user.entity';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create new user' })
    @ApiBody({ type: RegisterAuthDto })
    @ApiResponse({ status: 201, description: 'User created' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createUser(@Body() dto: RegisterAuthDto): Promise<void> {
        return this.authService.createUser({ dto })
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user in system' })
    @ApiBody({ type: LoginAuthDto })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async login(@Body() dto: LoginAuthDto): Promise<{ accessToken: string; email: string }> {
        return this.authService.login({ dto })
    }

    @Post('google')
    @ApiOperation({ summary: 'Login with google' })
    @ApiResponse({ status: 201, description: 'Google login OK' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async googleAuth(@Body('idToken') idToken: string) {
        return this.authService.validateGoogleToken(idToken)
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    @ApiResponse({ status: 200, description: 'Refresh token successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async refreshToken(@GetUser() user: User) {
        return this.authService.refreshToken({ userId: user.id })
    }

}
