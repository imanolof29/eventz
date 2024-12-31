import { ApiProperty } from "@nestjs/swagger"
import { UserDto } from "src/modules/users/dto/user.dto"

export class CommentDto {
    @ApiProperty({
        description: "Comment Id"
    })
    id: string

    @ApiProperty({
        description: "Comment content"
    })
    content: string

    @ApiProperty({
        description: "Owner of comment"
    })
    user: UserDto

    @ApiProperty({
        description: "Creation date of comment"
    })
    created: Date

    constructor(properties: { id: string, content: string, user: UserDto, created: Date }) {
        this.id = properties.id
        this.content = properties.content
        this.user = properties.user
        this.created = properties.created
    }

}