import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { passwordHash } from 'src/utils/password.utility';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) { }

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


}
