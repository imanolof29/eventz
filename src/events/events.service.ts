import { Injectable, NotFoundException } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>
    ) { }

    async getEvents(): Promise<EventDto[]> {
        return this.eventRepository.find().then((events) => events.map((event) => new EventDto({
            id: event.id,
            name: event.name,
            description: event.description,
            userId: event.user.id,
            created: event.created
        })))
    }

    async createEvent(properties: { dto: CreateEventDto, userId: string }) {
        /*await this.prisma.event.create({
            data: {
                name: properties.dto.name,
                description: properties.dto.description,
                images: properties.dto.images,
                latitude: properties.dto.latitude,
                longitude: properties.dto.longitude,
                userId: properties.userId,
                eventCategory: {
                    create: properties.dto.categoryIds.map(id => ({
                        category: {
                            connect: {
                                id
                            }
                        }
                    }))
                }
            }
        })*/
    }

    async getEventById(properties: { id: string }) {
        const event = await this.eventRepository.findOneBy({ id: properties.id })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        return new EventDto({
            id: event.id,
            name: event.name,
            description: event.description,
            userId: event.user.id,
            created: event.created
        })

    }

    async updateEvent(properties: { id: string; dto: UpdateEventDto }) {
        const event = await this.eventRepository.findOneBy({ id: properties.id })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        const updateEvent = Object.assign(event, properties.dto)

        await this.eventRepository.save(updateEvent)
    }

    async deleteEvent(properties: { id: string }) {
        const event = await this.eventRepository.findOneBy({ id: properties.id })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        await this.eventRepository.delete(event)
    }

}
