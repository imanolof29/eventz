import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
    @ApiProperty({
        description: "User Id"
    })
    id: string

    @ApiProperty({
        description: "User's First Name"
    })
    firstName: string

    @ApiProperty({
        description: "User's Last Name"
    })
    lastName: string

    @ApiProperty({
        description: "User's username"
    })
    username: string

    @ApiProperty({
        description: "User's profile photo"
    })
    profile?: string

    @ApiProperty({
        description: "User's email"
    })
    email: string

    @ApiProperty({
        description: "User's creation date"
    })
    created: Date

    constructor(properties: {
        id: string
        firstName: string
        lastName: string
        username: string
        profile?: string
        email: string
        created: Date
    }) {
        this.id = properties.id
        this.firstName = properties.firstName
        this.lastName = properties.lastName
        this.username = properties.username
        this.email = properties.email
        this.profile = properties.profile
        this.created = properties.created
    }

}