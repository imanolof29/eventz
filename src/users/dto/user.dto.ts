export class UserDto {
    id: string
    firstName: string
    lastName: string
    username: string
    email: string
    role: string

    constructor(properties: {
        id: string
        firstName: string
        lastName: string
        username: string
        email: string
        role: string
    }) {
        this.id = properties.id
        this.firstName = properties.firstName
        this.lastName = properties.lastName
        this.username = properties.username
        this.email = properties.email
        this.role = properties.role
    }

}