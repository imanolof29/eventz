import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { passwordHash } from 'src/utils/password.utility';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async createUser(properties: { dto: RegisterAuthDto }) {
        const userCreated = await this.userRepository.create(properties.dto)
        await this.userRepository.save(userCreated)
    }

    async login(properties: { dto: LoginAuthDto }) {
        const userFound = await this.userRepository.findOneBy({ email: properties.dto.email })

        if (!userFound) {
            throw new HttpException('Email does not exist', HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await passwordHash.comparePassword(properties.dto.password, userFound.password)

        if (!isPasswordValid) {
            throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN)
        }

        const payload = {
            id: userFound.id,
            name: userFound.firstName
        }

        const token = this.jwtService.sign(payload)

        const refresh = this.jwtService.sign(payload, { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' },)

        return { accessToken: token, refreshToken: refresh, email: userFound.email }

    }

    async refreshToken(properties: { userId: string }): Promise<AuthResponseDto> {
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        if (!user) throw new UnauthorizedException('User not found')
        const payload = {
            id: user.id,
            name: user.firstName
        }
        const token = this.jwtService.sign(payload)
        const refresh = this.jwtService.sign(payload, { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' })
        return { accessToken: token, refreshToken: refresh, email: user.email }
    }


}
