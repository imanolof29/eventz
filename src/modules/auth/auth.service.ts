import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { passwordHash } from 'src/utils/password.utility';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';
import { OAuth2Client } from 'google-auth-library';
import { EMAIL_DOES_NOT_EXIST, INCORRECT_PASSWORD } from 'src/errors/errors.constants';
import { ROLE_PERMISSIONS } from './role';
import { UserRole } from 'aws-sdk/clients/workmail';

@Injectable()
export class AuthService {

    private googleClient: OAuth2Client

    constructor(
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {
        this.googleClient = new OAuth2Client(
            this.configService.get('GOOGLE_CLIENT_ID')
        )
    }

    async createUser(properties: { dto: RegisterAuthDto }) {
        const userCreated = await this.userRepository.create(properties.dto)
        await this.userRepository.save(userCreated)
    }

    async login(properties: { dto: LoginAuthDto }) {
        const userFound = await this.userRepository.findOneBy({ email: properties.dto.email })

        if (!userFound) {
            throw new NotFoundException(EMAIL_DOES_NOT_EXIST)
        }

        const isPasswordValid = await passwordHash.comparePassword(properties.dto.password, userFound.password)

        if (!isPasswordValid) {
            throw new NotFoundException(INCORRECT_PASSWORD)
        }

        const payload = {
            id: userFound.id,
            name: userFound.firstName
        }

        const token = this.jwtService.sign(payload)

        const refresh = this.jwtService.sign(payload, { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' })

        const permissions = this.getPermissions(userFound.role)

        return { accessToken: token, refreshToken: refresh, email: userFound.email, permissions }

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

    async validateGoogleToken(idToken: string): Promise<any> {
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: this.configService.get('GOOGLE_CLIENT_ID')
        })
        const payload = ticket.getPayload()
        if (!payload) {
            throw new Error('Invalid token')
        }
        const {
            given_name,
            family_name,
            email,
            picture
        } = payload

        let user = await this.userRepository.findOneBy({ email })
        if (!user) {
            const newUser = await this.userRepository.create({
                firstName: given_name,
                lastName: family_name,
                email,
                profileImage: picture,
                username: email,
            })
            await this.userRepository.save(newUser)
            user = newUser
        }
        const newPayload = {
            id: user.id,
            name: user.firstName
        }

        const token = this.jwtService.sign(newPayload)
        const refresh = this.jwtService.sign(newPayload, { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' },)
        return { accessToken: token, refreshToken: refresh, email: user.email }
    }

    private getPermissions(role: UserRole): Promise<void> {
        return ROLE_PERMISSIONS[role]
    }


}
