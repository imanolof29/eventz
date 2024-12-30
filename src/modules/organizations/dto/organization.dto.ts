import { ApiProperty } from "@nestjs/swagger"

export class OrganizationDto {
    @ApiProperty({ description: "Organization's id" })
    id: string

    @ApiProperty({ description: "Organization's name" })
    name: string

    @ApiProperty({ description: "User" })
    userId: string

    @ApiProperty({ description: "Organization's location/place" })
    placeId: string

    @ApiProperty({ description: "Organization's logo" })
    logo?: string

    @ApiProperty({ description: "Organization's creation date" })
    created: Date

    constructor(properties: {
        id: string,
        name: string,
        userId: string,
        placeId: string,
        logo?: string,
        created: Date
    }) {
        this.id = properties.id
        this.name = properties.name
        this.userId = properties.userId
        this.placeId = properties.placeId
        this.logo = properties.logo
        this.created = properties.created
    }

}