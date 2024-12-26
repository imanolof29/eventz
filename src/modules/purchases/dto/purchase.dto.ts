import { PurchaseStatus } from "../purchase.entity"

export class PurchaseDto {
    id: string
    buyerId: string
    eventId: string
    purchaseDate: Date
    status: PurchaseStatus
    quantity: number
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