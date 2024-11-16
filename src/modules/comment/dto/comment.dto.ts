import { UserDto } from "src/modules/users/dto/user.dto"

export class CommentDto {
    id: string
    content: string
    user: UserDto
    created: Date

    constructor(properties: { id: string, content: string, user: UserDto, created: Date }) {
        this.id = properties.id
        this.content = properties.content
        this.user = properties.user
        this.created = properties.created
    }

}