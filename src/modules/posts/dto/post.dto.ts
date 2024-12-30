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

    constructor(properties: {
        id: string,
        photo: string
    }) {
        this.id = properties.id
        this.photo = properties.photo
    }

}