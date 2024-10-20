import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/events/event.entity';
import { Purchase } from './purchase.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class PurchasesService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Purchase) private purchaseRepository: Repository<Purchase>
    ) { }

    async purchase(userId: string, eventId: string, quantity: number): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: userId })
        const event = await this.eventRepository.findOneBy({ id: eventId })
        if (!user) {
            throw new BadRequestException('User not found')
        }
        if (!event) {
            throw new BadRequestException('Event not found')
        }
        if (event.ticketsSold + quantity > event.ticketLimit) {
            throw new BadRequestException('Ticket limit reached')
        }
        const purchase = this.purchaseRepository.create({
            buyer: user,
            event,
            purchaseDate: new Date()
        })
        event.ticketsSold += quantity
        await this.eventRepository.save(event)
        await this.purchaseRepository.save(purchase)
    }

    async getUserPurchases(properties: { userId: string }): Promise<PurchaseDto[]> {
        const user = await this.userRepository.findBy({ id: properties.userId })
        if (!user) {
            throw new BadRequestException('User not found')
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
