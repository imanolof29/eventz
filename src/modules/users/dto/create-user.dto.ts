import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "../user.entity"

export class CreateUserDto {

    @ApiProperty({ example: 'Antonio', description: 'User first name' })
    firstName: string

    @ApiProperty({ example: 'Recio', description: 'User last name' })
    lastName: string

    @ApiProperty({ example: 'antoniorecio', description: 'User username' })
    username: string

    @ApiProperty({ example: 'arecio@gmail.com', description: 'User email' })
    email: string

    @ApiProperty({ example: 'Password_123%', description: 'User password' })
    password: string

    @ApiProperty({ example: 'USER', description: 'Default USER' })
    role: UserRole

    constructor(properties: {
        firstName: string
        lastName: string
        username: string
        email: string
        password: string
        role: UserRole
    }) {
        this.firstName = properties.firstName
        this.lastName = properties.lastName
        this.username = properties.username
        this.email = properties.email
        this.password = properties.password
        this.role = properties.role
    }
}