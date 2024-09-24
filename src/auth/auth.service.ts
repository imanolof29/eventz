import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { passwordHash } from 'src/utils/password.utility';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async createUser(properties: { dto: RegisterAuthDto }) {
        const hashedPassword = await passwordHash.cryptPassword(properties.dto.password)
        await this.prisma.user.create({
            data: {
                firstName: properties.dto.firstName,
                lastName: properties.dto.lastName,
                username: properties.dto.username,
                email: properties.dto.email,
                password: hashedPassword,
            }
        })
    }

    async login(properties: { dto: LoginAuthDto }) {
        const userFound = await this.prisma.user.findUnique({
            where: {
                email: properties.dto.email
            }
        })

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


}
