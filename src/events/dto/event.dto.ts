export class EventDto {
    id: string
    name: string
    description: string
    latitude: number
    longitude: number
    images: string[]
    userId: string
    created: Date

    constructor(properties: {
        id: string;
        name: string;
        description: string;
        latitude: number;
        longitude: number
        images: string[];
        userId: string
        created: Date
    }) {
        this.id = properties.id
        this.name = properties.name
        this.description = properties.description
        this.longitude = properties.longitude
        this.latitude = properties.latitude
        this.images = properties.images
        this.userId = properties.userId
        this.created = properties.created
    }

}