import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/modules/categories/category.entity';
import { User } from 'src/modules/users/user.entity';
import { EVENT_NOT_FOUND } from 'src/errors/errors.constants';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { Organization } from '../organizations/organization.entity';

@Injectable()
export class EventsService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async getEvents(pagination: PaginationDto): Promise<PaginationResponseDto<EventDto>> {

        try {
            // Asignar valores predeterminados de paginación
            const limit = pagination.limit ?? 10;
            const page = pagination.page ?? 0;

            // Obtener eventos y total de registros usando paginación
            const [events, total] = await this.eventRepository.findAndCount({
                relations: ['organizer'],
                order: {
                    "created": 'desc'
                },
                skip: limit * page,
                take: limit
            });

            // Calcular el número total de páginas
            const totalPages = Math.ceil(total / limit);

            // Mapear los eventos a DTOs
            const eventsDto = events.map((event) => {
                return new EventDto({
                    id: event.id,
                    name: event.name,
                    description: event.description,
                    //TODO: SOLUCION TEMPORAL
                    userId: "",
                    created: event.created,
                    price: event.price,
                    ticketLimit: event.ticketLimit,
                    ticketsSold: event.ticketsSold
                })
            });

            return {
                data: eventsDto,
                total,
                page: Math.floor(page / limit) + 1,
                limit,
                totalPages
            };
        } catch (e) {
            console.log(e)
            throw e
        }
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
        try {
            const user = await this.userRepository.findOneByOrFail({ id: properties.userId })
            const organizer = await this.organizationRepository.findOneByOrFail({
                employees: {
                    id: user.id
                }
            })
            if (!organizer.place) {
                throw new BadRequestException("Organization does not have a place")
            }
            const categories = await this.categoryRepository.find({ where: { id: In(properties.dto.categoryIds) } })
            const newEvent = await this.eventRepository.create({
                name: properties.dto.name,
                description: properties.dto.description,
                organizer,
                categories,
                price: properties.dto.price,
                ticketLimit: properties.dto.ticketLimit,
                ticketsSold: properties.dto.ticketsSold
            })

            return await this.eventRepository.save(newEvent)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getEventById(properties: { id: string }) {
        const event = await this.eventRepository.findOne({
            where: {
                id: properties.id
            }, relations: ['user']
        })

        if (!event) {
            throw new NotFoundException(EVENT_NOT_FOUND)
        }

        return new EventDto({
            id: event.id,
            name: event.name,
            description: event.description,
            userId: event.organizer.id,
            created: event.created,
            price: event.price,
            ticketLimit: event.ticketLimit,
            ticketsSold: event.ticketsSold
        })

    }

    async updateEvent(properties: { id: string; dto: UpdateEventDto }) {
        const event = await this.eventRepository.findOneBy({ id: properties.id })

        if (!event) {
            throw new NotFoundException(EVENT_NOT_FOUND)
        }

        const updateEvent = Object.assign(event, properties.dto)

        await this.eventRepository.save(updateEvent)
    }

    async deleteEvent(properties: { id: string }) {
        const event = await this.eventRepository.findOneBy({ id: properties.id })

        if (!event) {
            throw new NotFoundException(EVENT_NOT_FOUND)
        }

        return await this.eventRepository.remove(event)
    }

}
