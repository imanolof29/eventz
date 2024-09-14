export class CategoryDto {
    id: string
    name: string
    created: Date

    constructor(properties: { id: string; name: string; created: Date }) {
        this.id = properties.id
        this.name = properties.name
        this.created = properties.created
    }

}