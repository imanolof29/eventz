import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Point } from "typeorm";

export class PlaceDto {

    @ApiProperty({ example: '92e58387-515d-4b51-8a88-c6ec43384850', description: 'Place id' })
    id: string

    @ApiProperty({ example: 'Rocket', description: 'Name' })
    name: string

    @ApiProperty({ example: 'Live Music Venue', description: 'Description' })
    description?: string

    @ApiProperty({
        example: {
            type: 'Point',
            coordinates: [
                43.3365,
                -1.7852
            ]
        },
        description: 'Place geoposition'
    })
    position: Point

    @ApiProperty({ example: 'Bilbao', description: 'City' })
    city?: string

    @ApiProperty({ example: 'Calle Tellería', description: 'Street' })
    street?: string

    @ApiProperty({ example: '48004', description: 'Post code' })
    postcode?: string

    @ApiProperty({ example: '8', description: 'House number' })
    housenumber?: string

    @ApiProperty({ example: 'https://example.com', description: 'Website' })
    website?: string

    @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
    email?: string

    @ApiProperty({ example: 'https://facebook.com/people/xxxx/id', description: 'Facebook url' })
    facebook?: string

    @ApiProperty({ example: '@example', description: 'Instagram user' })
    instagram?: string

    @ApiProperty({ example: '944598617', description: 'Place phone number' })
    phone?: string

    @ApiProperty({ example: '4727750130', description: 'Open Street Map Id' })
    osmId: string

    constructor(properties: {
        id: string,
        name: string,
        description?: string
        position: Point
        city?: string
        street?: string
        postcode?: string
        housenumber?: string
        website?: string
        facebook?: string
        instagram?: string
        email?: string
        phone?: string
        osmId: string
    }) {
        this.id = properties.id
        this.name = properties.name
        this.description = properties.description
        this.position = properties.position
        this.city = properties.city
        this.street = properties.street
        this.postcode = properties.postcode
        this.housenumber = properties.housenumber
        this.website = properties.website
        this.facebook = properties.facebook
        this.email = properties.email
        this.instagram = properties.instagram
        this.phone = properties.phone
        this.osmId = properties.osmId
    }

}