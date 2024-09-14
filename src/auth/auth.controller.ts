import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('create')
    async createUser(@Body() dto: RegisterAuthDto): Promise<void> {
        return this.authService.createUser({ dto })
    }

    @Post('login')
    async login(@Body() dto: LoginAuthDto): Promise<{ accessToken: string; email: string }> {
        return this.authService.login({ dto })
    }

}
