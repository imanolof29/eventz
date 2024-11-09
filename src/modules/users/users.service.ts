import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async getUsers(pagination: PaginationDto): Promise<PaginationResponseDto<UserDto>> {
        //Asignar valores predeterminados de paginación
        const limit = pagination.limit ?? 10
        const page = pagination.page ?? 0

        //Obtener usuarios y total de registros usando paginación
        const [users, total] = await this.userRepository.findAndCount({
            skip: limit * page,
            take: limit,
            order: {
                "created": 'desc'
            }
        })

        // Calcular el número total de paginas
        const totalPages = Math.ceil(total / limit)

        const usersDto = users.map((user) => new UserDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            created: user.created
        }))

        return {
            data: usersDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages
        }

    }

    async createUser(properties: { dto: CreateUserDto }): Promise<void> {
        const createdUser = await this.userRepository.create(properties.dto)
        await this.userRepository.save(createdUser)
    }

    async getUserById(properties: { id: string }): Promise<UserDto> {
        const user = await this.userRepository.findOneBy({ id: properties.id })

        if (!user) {
            throw new NotFoundException('User not found')
        }
        return new UserDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            created: user.created
        })
    }

    async updateUser(properties: { id: string; dto: UpdateUserDto }): Promise<void> {
        const userFound = await this.userRepository.findOneBy({ id: properties.id })
        if (!userFound) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        const updatedUser = Object.assign(userFound, properties.dto)

        await this.userRepository.save(updatedUser)
    }

}
