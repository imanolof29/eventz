export class EventDto {
    id: string
    name: string
    description: string
    userId: string
    created: Date

    constructor(properties: {
        id: string;
        name: string;
        description: string;
        userId: string
        created: Date
    }) {
        this.id = properties.id
        this.name = properties.name
        this.description = properties.description
        this.userId = properties.userId
        this.created = properties.created
    }

}