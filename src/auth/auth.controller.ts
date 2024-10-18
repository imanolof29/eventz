import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { RefreshJwtGuard } from './guards/refresh-auth.guard';
import { User } from 'src/users/user.entity';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('create')
    @ApiBody({
        type: RegisterAuthDto,
    })
    async createUser(@Body() dto: RegisterAuthDto): Promise<void> {
        return this.authService.createUser({ dto })
    }

    @Post('login')
    @ApiBody({
        type: LoginAuthDto
    })
    async login(@Body() dto: LoginAuthDto): Promise<{ accessToken: string; email: string }> {
        return this.authService.login({ dto })
    }

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth() {
    }

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        return res.status(HttpStatus.OK)
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@GetUser() user: User) {
        return this.authService.refreshToken({ userId: user.id })
    }

}
