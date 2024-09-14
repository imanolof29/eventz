import { UserRole } from "@prisma/client"

export class CreateUserDto {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
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