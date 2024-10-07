import { Injectable, NotFoundException } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { In, Point, Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class EventsService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async getEvents(): Promise<EventDto[]> {
        const events = await this.eventRepository.find({
            relations: ['user']
        })
        return events.map((event) => new EventDto({
            id: event.id,
            name: event.name,
            description: event.description,
            userId: event.user.id,
            created: event.created,
            position: event.position
        }))
    }

    async getNearbyEvents(properties: { radius: number; latitude: number; longitude: number }) {
        const events = await this.eventRepository
            .createQueryBuilder('events')
            .where(
                `ST_DWithin(
                events.position,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
                :radius
            )`,
                {
                    latitude: properties.latitude,
                    longitude: properties.longitude,
                    radius: properties.radius,
                }
            )
            .getMany();
    }

    async createEvent(properties: { dto: CreateEventDto, userId: string }) {
        const categories = await this.categoryRepository.find({ where: { id: In(properties.dto.categoryIds) } })
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        const position: Point = {
            type: 'Point',
            coordinates: [properties.dto.latitude, properties.dto.longitude]
        };
        const newEvent = await this.eventRepository.create({
            name: properties.dto.name,
            description: properties.dto.description,
            position,
            user,
            categories,
        })

        await this.eventRepository.save(newEvent)
        /*try {
            await this.eventRepository.query(`
                INSERT INTO
                    events(
                        name,
                        description,
                        position,
                        categories,
                        userId,
                    )
                VALUES(
                    ${properties.dto.name},
                    ${properties.dto.description},
                    ST_GeomFromText('POINT(${properties.dto.latitude} ${properties.dto.longitude})', 4326),
                    ${properties.dto.categoryIds},
                    ${properties.userId}
                )
            `)
        } catch (e) {
            console.log(e)
        }*/
    }

    async getEventById(properties: { id: string }) {
        const event = await this.eventRepository.findOne({
            where: {
                id: properties.id
            }, relations: ['user']
        })

        if (!event) {
            throw new NotFoundException('Event not found')
        }

        return new EventDto({
            id: event.id,
            name: event.name,
            description: event.description,
            userId: event.user.id,
            created: event.created,
            position: event.position
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
