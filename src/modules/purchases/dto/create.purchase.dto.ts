import { ApiProperty } from "@nestjs/swagger"

export class CreatePurchaseDto {
    @ApiProperty({
        description: "Event to purchase"
    })
    eventId: string
    @ApiProperty({
        description: "Amount to pay"
    })
    quantity: number
}