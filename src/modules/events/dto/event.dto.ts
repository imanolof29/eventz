import { ApiProperty } from "@nestjs/swagger"

export class EventDto {

    @ApiProperty({ example: '92e58387-515d-4b51-8a88-c6ec43384850', description: 'Event id' })
    id: string

    @ApiProperty({ example: 'Fiestas', description: 'Event name' })
    name: string

    @ApiProperty({ example: 'Fiestas en donosti', description: 'Event description' })
    description: string

    @ApiProperty({ example: '19b50ab0-ef3f-4428-a152-d2b3ae11d710', description: 'User id' })
    userId: string

    @ApiProperty({ example: new Date(), description: 'Event created at' })
    created: Date

    @ApiProperty({ example: 9.99, description: 'Event price' })
    price?: number

    @ApiProperty({ example: 300, description: 'Ticket limit' })
    ticketLimit?: number

    @ApiProperty({ example: 150, description: 'Tickets sold' })
    ticketsSold: number

    constructor(properties: {
        id: string;
        name: string;
        description: string;
        userId: string
        created: Date
        price?: number
        ticketLimit?: number
        ticketsSold: number
    }) {
        this.id = properties.id
        this.name = properties.name
        this.description = properties.description
        this.userId = properties.userId
        this.created = properties.created
        this.price = properties.price
        this.ticketLimit = properties.ticketLimit
        this.ticketsSold = properties.ticketsSold
    }

}