import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { EMAIL_ALREADY_EXISTS, EMAIL_DOES_NOT_EXIST, INCORRECT_PASSWORD, INVALID_PASSWORD, USER_NOT_ACTIVE, USER_NOT_FOUND, USERNAME_ALREADY_EXISTS } from 'src/errors/errors.constants';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Verification } from './verification.entity';
import { EmailService } from 'src/providers/email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

    private googleClient: OAuth2Client

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
    ) {
        this.googleClient = new OAuth2Client(
            this.configService.get('GOOGLE_CLIENT_ID')
        )
    }

    async createUser(properties: { dto: RegisterAuthDto }) {
        const emailExists = await this.userRepository.findOneBy({ email: properties.dto.email })
        if (emailExists) {
            throw new HttpException(EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST)
        }
        const usernameExists = await this.userRepository.findOneBy({ username: properties.dto.username })
        if (usernameExists) {
            throw new HttpException(USERNAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await passwordHash.cryptPassword(properties.dto.password)
        const userCreated = await this.userRepository.create({ ...properties.dto, password: hashPassword })
        await this.userRepository.save(userCreated)
    }

    async login(properties: { dto: LoginAuthDto }) {
        const userFound = await this.userRepository.findOneBy({ email: properties.dto.email })

        if (!userFound) {
            throw new NotFoundException(EMAIL_DOES_NOT_EXIST)
        }

        if (userFound.deletedAt) {
            throw new ForbiddenException(USER_NOT_ACTIVE)
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

        const refresh = this.jwtService.sign(payload, { secret: this.configService.get('REFRESH_SECRET'), expiresIn: '30d' },)

        return { accessToken: token, refreshToken: refresh, email: userFound.email }

    }

    async refreshToken(properties: { userId: string }): Promise<AuthResponseDto> {
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        if (!user) throw new UnauthorizedException(USER_NOT_FOUND)
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

    async changePassword(properties: { userId: string, dto: ChangePasswordDto }) {
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        if (!user) throw new NotFoundException(USER_NOT_FOUND)
        const isPasswordValid = await passwordHash.comparePassword(properties.dto.oldPassword, user.password)
        if (!isPasswordValid) throw new HttpException(INVALID_PASSWORD, HttpStatus.BAD_REQUEST)
        user.password = await passwordHash.cryptPassword(properties.dto.newPassword)
        await this.userRepository.save(user)
    }

    async createEmailVerificationToken(user: User): Promise<void> {
        const token = crypto.randomBytes(16).toString('hex')
        const emailVerification = await this.verificationRepository.create({
            token,
            user
        })
        await this.verificationRepository.save(emailVerification)
        await this.emailService.sendMail(user.email, 'verify-email', { name: user.firstName, link: `localhost:3000/auth/verify-email?token=${emailVerification.token}` })
    }

    async verifyEmail(token: string): Promise<void> {
        const verification = await this.verificationRepository.findOne({ where: { token }, relations: ['user'] })
        if (!verification) throw new NotFoundException('TOKEN NOT FOUND')
        const { user } = verification
        user.verified = true
        await this.userRepository.save(user)
        await this.verificationRepository.delete(verification)
    }


}
