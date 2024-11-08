import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async getUsers(): Promise<UserDto[]> {
        return this.userRepository.find().then((users) => users.map((user) => new UserDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            created: user.created
        })))
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
