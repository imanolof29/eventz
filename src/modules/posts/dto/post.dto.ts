export class PostDto {
    id: string
    photo: string

    constructor(properties: {
        id: string,
        photo: string
    }) {
        this.id = properties.id
        this.photo = properties.photo
    }

}