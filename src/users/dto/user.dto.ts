export class UserDto {
    id: string
    firstName: string
    lastName: string
    username: string
    email: string
    created: Date

    constructor(properties: {
        id: string
        firstName: string
        lastName: string
        username: string
        email: string
        created: Date
    }) {
        this.id = properties.id
        this.firstName = properties.firstName
        this.lastName = properties.lastName
        this.username = properties.username
        this.email = properties.email
        this.created = properties.created
    }

}