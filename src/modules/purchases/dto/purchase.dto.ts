import { ApiProperty } from "@nestjs/swagger"
import { PurchaseStatus } from "../purchase.entity"

export class PurchaseDto {
    @ApiProperty({
        description: "Purchase Id"
    })
    id: string
    @ApiProperty({
        description: "Buyer Id"
    })
    buyerId: string
    @ApiProperty({
        description: "Event Id"
    })
    eventId: string
    @ApiProperty({
        description: "Purchase Date"
    })
    purchaseDate: Date
    @ApiProperty({
        description: "Status"
    })
    status: PurchaseStatus
    @ApiProperty({
        description: "Amount"
    })
    quantity: number

    @ApiProperty({
        description: "Qr code"
    })
    qrCode: string

    constructor(properties: { id: string, buyerId: string, eventId: string, purchaseDate: Date, status: PurchaseStatus, quantity: number, qrCode: string }) {
        this.id = properties.id
        this.buyerId = properties.buyerId
        this.eventId = properties.eventId
        this.purchaseDate = properties.purchaseDate
        this.status = properties.status
        this.quantity = properties.quantity
        this.qrCode = properties.qrCode
    }

}