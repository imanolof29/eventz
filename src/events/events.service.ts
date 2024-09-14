import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EventDto } from './dto/event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {

    constructor(private prisma: PrismaService) { }

    async getEvents(): Promise<EventDto[]> {
        const events = await this.prisma.event.findMany()
        return events.map((event) => new EventDto({
            id: event.id,
            name: event.name,
            description: event.description,
            latitude: event.latitude,
            longitude: event.longitude,
            images: event.images,
            userId: event.userId,
            created: event.created
        }))
    }

    async createEvent(properties: { dto: CreateEventDto, userId: string }) {
        await this.prisma.event.create({
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
        })
    }

    async getEventById(properties: { id: string }) {
        const event = await this.prisma.event.findUnique({
            where: {
                id: properties.id
            }
        })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        return new EventDto({
            id: event.id,
            name: event.name,
            description: event.name,
            latitude: event.latitude,
            longitude: event.longitude,
            images: event.images,
            userId: event.userId,
            created: event.created
        })

    }

    async updateEvent(properties: { id: string; dto: UpdateEventDto }) {
        await this.prisma.event.update({
            where: {
                id: properties.id
            },
            data: {
                name: properties.dto.name,
                description: properties.dto.description,
                latitude: properties.dto.latitude,
                longitude: properties.dto.longitude,
                images: properties.dto.images
            }
        })
    }

    async deleteEvent(properties: { id: string }) {
        await this.prisma.eventCategory.deleteMany({
            where: {
                eventId: properties.id
            }
        })
        await this.prisma.event.delete({
            where: {
                id: properties.id
            }
        })
    }

}
