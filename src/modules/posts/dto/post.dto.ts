import { ApiProperty } from "@nestjs/swagger"

export class PostDto {
    @ApiProperty({
        description: "Post Id"
    })
    id: string

    @ApiProperty({
        description: "Photo of post"
    })
    photo: string

    @ApiProperty({
        description: "Place of post"
    })
    placeId: string

    constructor(properties: {
        id: string,
        photo: string,
        placeId: string
    }) {
        this.id = properties.id
        this.photo = properties.photo
        this.placeId = properties.placeId
    }

}