import { ApiProperty } from "@nestjs/swagger";

export class PlaceDto {

    @ApiProperty({ example: '92e58387-515d-4b51-8a88-c6ec43384850', description: 'Place id' })
    id: string

    name: string

    description?: string

    constructor(properties: { id: string, name: string, description?: string }) {
        this.id = properties.id
        this.name = properties.name
        this.description = properties.description
    }

}