import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/modules/events/event.entity';
import { Purchase } from './purchase.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { StripeService } from 'src/providers/stripe/stripe.service';
import { PURCHASE_NOT_FOUND, USER_NOT_FOUND } from 'src/errors/errors.constants';
import * as QRCode from 'qrcode';
import { EmailService } from 'src/providers/email/email.service';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PurchasesService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Purchase) private purchaseRepository: Repository<Purchase>,
        private readonly stripeService: StripeService,
        private readonly emailService: EmailService
    ) { }

    async purchase(userId: string, eventId: string, quantity: number): Promise<any> {
        try {
            const user = await this.userRepository.findOneBy({ id: userId })
            const event = await this.eventRepository.findOneBy({ id: eventId })
            if (!user) {
                throw new BadRequestException('User not found')
            }
            if (!event) {
                throw new BadRequestException('Event not found')
            }
            // if (event.ticketsSold + quantity > event.ticketLimit) {
            //     throw new BadRequestException('Ticket limit reached')
            // }
            //const payment = await this.stripeService.paymentIntent({ amount: event.price * quantity, currency: 'eur', clientEmail: user.email })
            const purchase = this.purchaseRepository.create({
                buyer: user,
                event,
                purchaseDate: new Date()
            })
            const qr = await QRCode.toDataURL(JSON.stringify({ purchaseId: purchase.id, eventId: event.id }))
            purchase.qrCode = qr
            event.ticketsSold += quantity
            await this.eventRepository.save(event)
            await this.purchaseRepository.save(purchase)
            await this.emailService.sendMail(
                user.email,
                'purchase-confirmation',
                {
                    name: user.firstName,
                    email: user.email,
                    purchaseId: purchase.id,
                    eventName: event.name,
                    ticketsBought: quantity,
                    eventDate: event.startDate,
                    amount: event.price * quantity,
                    qrImage: qr
                }
            )
            return ""
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getUserPurchases(properties: { pagination: PaginationDto, userId: string }): Promise<PaginationResponseDto<PurchaseDto>> {
        try {
            const user = await this.userRepository.findBy({ id: properties.userId })
            if (!user) {
                throw new BadRequestException(USER_NOT_FOUND)
            }
            const [purchases, total] = await this.purchaseRepository.findAndCount({
                relations: ['buyer', 'event'],
            })

            const limit = properties.pagination.limit ?? 10
            const page = properties.pagination.page ?? 0

            const totalPages = Math.ceil(total / limit)

            const purchasesDto = purchases.map((purchase) => new PurchaseDto({
                id: purchase.id,
                buyerId: purchase.buyer.id,
                eventId: purchase.event.id,
                purchaseDate: purchase.purchaseDate,
                status: purchase.status,
                quantity: purchase.quantity,
                qrCode: purchase.qrCode
            }))
            return {
                data: purchasesDto,
                total,
                page: Math.floor(page / limit) + 1,
                limit,
                totalPages
            }
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async getPurchaseById(properties: { id: string, userId: string }): Promise<PurchaseDto> {
        try {
            const purchase = await this.purchaseRepository.findOne({
                relations: ['buyer', 'event'],
                where: {
                    id: properties.id,
                    buyer: {
                        id: properties.userId
                    }
                }
            })
            if (!purchase) {
                throw new BadRequestException(PURCHASE_NOT_FOUND)
            }

            return new PurchaseDto({
                id: purchase.id,
                buyerId: purchase.buyer.id,
                eventId: purchase.event.id,
                purchaseDate: purchase.purchaseDate,
                status: purchase.status,
                quantity: purchase.quantity,
                qrCode: purchase.qrCode
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    }

}
