export class CommentDto {
    content: string
    userId: string

    constructor(properties: { content: string, userId: string }) {
        this.content = properties.content
        this.userId = properties.userId
    }

}