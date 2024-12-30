import { ApiProperty } from "@nestjs/swagger";

export class CategoryDto {
    @ApiProperty({
        description: "Category Id"
    })
    id: string

    @ApiProperty({
        description: "Category name"
    })
    name: string

    @ApiProperty({
        description: "Category creation date"
    })
    created: Date

    constructor(properties: { id: string; name: string; created: Date }) {
        this.id = properties.id
        this.name = properties.name
        this.created = properties.created
    }

}