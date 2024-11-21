import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { Point, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PlaceDto } from './dto/place.dto';
import { PLACE_NOT_FOUND } from 'src/errors/errors.constants';
import { EmailService } from 'src/providers/email/email.service';

@Injectable()
export class PlacesService {

    constructor(
        @InjectRepository(Place) private placeRepository: Repository<Place>,
        private readonly emailService: EmailService
    ) { }

    async getPlaces(pagination: PaginationDto): Promise<PaginationResponseDto<PlaceDto>> {
        //Asignar valores predeterminados de paginación
        const limit = pagination.limit ?? 10
        const page = pagination.page ?? 0

        //Obtener eventos y total de registros usando paginación
        const [places, total] = await this.placeRepository.findAndCount({
            skip: limit * page,
            take: limit
        })

        //Calcular el número total de páginas
        const totalPages = Math.ceil(total / limit)

        //Mapear places a DTOs
        const placesDto = places.map((place) => new PlaceDto({
            id: place.id,
            name: place.name,
            description: place.description,
            position: place.position,
            city: place.city,
            street: place.street,
            postcode: place.postcode,
            housenumber: place.housenumber,
            website: place.website,
            instagram: place.instagram,
            email: place.email,
            facebook: place.facebook,
            phone: place.phone,
            osmId: place.osmId
        }))

        await this.emailService.sendEmail("imanolof29@gmail.com", "Imanol")

        return {
            data: placesDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages
        }
    }

    async getPlacesNearPosition(properties: { lat: number, lon: number, radius: number, pagination: PaginationDto }) {
        const radiusInDegrees = properties.radius / 111000;

        // Valores predeterminados de paginación
        const limit = properties.pagination.limit ?? 10;
        const page = properties.pagination.page ?? 0;

        // Construir la consulta con paginación y filtros espaciales
        const [places, total] = await this.placeRepository
            .createQueryBuilder('places')
            .where(
                `
                ST_DWithin (
                    places.position,
                    ST_SetSRID(
                        ST_MakePoint(
                            ${properties.lat}, 
                            ${properties.lon}
                        ), 
                    4326
                ),
                ${radiusInDegrees}
                )
                `,
            )
            .skip(limit * page) // Paginación: saltar los registros ya cubiertos
            .take(limit) // Paginación: limitar los registros por página
            .getManyAndCount(); // Obtener tanto los registros como el total

        // Calcular el número total de páginas
        const totalPages = Math.ceil(total / limit);

        // Mapear los resultados a PlaceDto
        const placesDto = places.map(
            (place) =>
                new PlaceDto({
                    id: place.id,
                    name: place.name,
                    description: place.description,
                    position: place.position,
                    city: place.city,
                    street: place.street,
                    postcode: place.postcode,
                    housenumber: place.housenumber,
                    website: place.website,
                    instagram: place.instagram,
                    email: place.email,
                    facebook: place.facebook,
                    phone: place.phone,
                    osmId: place.osmId,
                })
        );

        return {
            data: placesDto,
            total,
            page,
            limit,
            totalPages,
        };
    }

    async getPlaceById(properties: { id: string }) {
        const place = await this.placeRepository.findOne({
            where: {
                id: properties.id
            }
        })

        if (!place) {
            throw new NotFoundException(PLACE_NOT_FOUND)
        }

        return new PlaceDto({
            id: place.id,
            name: place.name,
            description: place.description,
            position: place.position,
            city: place.city,
            street: place.street,
            postcode: place.postcode,
            housenumber: place.housenumber,
            website: place.website,
            instagram: place.instagram,
            email: place.email,
            facebook: place.facebook,
            phone: place.phone,
            osmId: place.osmId
        })

    }

    async deleteAllData(): Promise<void> {
        await this.placeRepository.delete({})
    }

    async importData(file: Express.Multer.File): Promise<void> {
        const data = JSON.parse(file.buffer.toString())
        const elements = data.elements
        elements.forEach(async (element: any) => {
            //Si no tiene tags viene vacio por lo que no tiene info
            if (!element.tags) return

            const osmId = element.id.toString();
            const name = element.tags.name as string;
            const description = element.tags.description as string;
            //Convertimos a un point compatible con BBDD
            const position: Point = {
                type: 'Point',
                coordinates: [element.lat, element.lon]
            }
            const email = element.tags.email as string
            const street = element.tags['addr:street'] as string;
            const city = element.tags['addr:city'] as string;
            const postcode = element.tags['addr:postcode'] as string;
            const housenumber = element.tags['addr:housenumber'] as string;
            const website = element.tags.website as string;
            const facebook = element.tags['contact:facebook'] as string;
            const instagram = element.tags['contact:instagram'] as string;
            const phone = element.tags.phone as string;

            //Si no tiene nombre next
            if (!name) return

            const newPlace = await this.placeRepository.create({
                name,
                description,
                position,
                city,
                email,
                street,
                postcode,
                housenumber,
                website,
                facebook,
                instagram,
                phone,
                osmId
            })

            await this.placeRepository.save(newPlace)
        })
        return Promise.resolve()
    }

}
