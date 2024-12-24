export class OrganizationDto {
    id: string
    name: string
    userId: string
    placeId: string
    logo?: string
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