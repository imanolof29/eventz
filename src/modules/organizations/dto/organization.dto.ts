export class OrganizationDto {
    id: string
    name: string
    logo?: string
    created: Date

    constructor(properties: {
        id: string,
        name: string,
        logo?: string,
        created: Date
    }) {
        this.id = properties.id
        this.name = properties.name
        this.logo = properties.logo
        this.created = properties.created
    }

}