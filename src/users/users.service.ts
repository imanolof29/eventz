import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { passwordHash } from 'src/utils/password.utility';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

    async getUsers(): Promise<UserDto[]> {
        const users = await this.prisma.user.findMany()
        return users.map((user) => new UserDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            created: user.created
        }))
    }

    async createUser(properties: { dto: CreateUserDto }): Promise<void> {
        const hashedPassword = await passwordHash.cryptPassword(properties.dto.password)
        await this.prisma.user.create({
            data: {
                firstName: properties.dto.firstName,
                lastName: properties.dto.lastName,
                email: properties.dto.email,
                username: properties.dto.username,
                role: properties.dto.role,
                password: hashedPassword,
            }
        })
    }

    async getUserById(properties: { id: string }): Promise<UserDto> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: properties.id
            },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return new UserDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role,
            created: user.created
        })
    }

    async updateUser(properties: { id: string; dto: UpdateUserDto }): Promise<void> {
        await this.prisma.user.update({
            where: {
                id: properties.id
            },
            data: {
                firstName: properties.dto.firstName,
                lastName: properties.dto.lastName,
                username: properties.dto.username
            }
        })
    }

}
