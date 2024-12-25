import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/modules/events/event.entity';
import { Purchase } from './purchase.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { StripeService } from 'src/providers/stripe/stripe.service';
import { USER_NOT_FOUND } from 'src/errors/errors.constants';

@Injectable()
export class PurchasesService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Purchase) private purchaseRepository: Repository<Purchase>,
        private readonly stripeService: StripeService
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
            const payment = await this.stripeService.paymentIntent({ amount: event.price * quantity, currency: 'eur', clientEmail: user.email })
            const purchase = this.purchaseRepository.create({
                buyer: user,
                event,
                purchaseDate: new Date()
            })
            event.ticketsSold += quantity
            await this.eventRepository.save(event)
            await this.purchaseRepository.save(purchase)
            return payment
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getUserPurchases(properties: { userId: string }): Promise<PurchaseDto[]> {
        const user = await this.userRepository.findBy({ id: properties.userId })
        if (!user) {
            throw new BadRequestException(USER_NOT_FOUND)
        }
        const purchases = await this.purchaseRepository.find({
            relations: ['user', 'event'],
        })
        return purchases.map((purchase) => new PurchaseDto({
            id: purchase.id,
            buyerId: purchase.buyer.id,
            eventId: purchase.event.id,
            purchaseDate: purchase.purchaseDate,
            status: purchase.status,
            quantity: purchase.quantity
        }))
    }

}
