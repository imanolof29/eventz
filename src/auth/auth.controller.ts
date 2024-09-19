import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

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

}
