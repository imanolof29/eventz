export class NotificationDto {
    id: string
    userId: string
    title: string
    message: string
    read: boolean
    created: Date

    constructor(properties: {
        id: string;
        userId: string;
        title: string;
        message: string;
        read: boolean;
        created: Date
    }) {
        this.id = properties.id
        this.userId = properties.userId
        this.title = properties.title
        this.message = properties.message
        this.read = properties.read
        this.created = properties.created
    }

}