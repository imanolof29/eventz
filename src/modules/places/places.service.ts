import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { Point, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PlaceDto } from './dto/place.dto';

@Injectable()
export class PlacesService {

    constructor(
        @InjectRepository(Place) private placeRepository: Repository<Place>
    ) { }

    async getPlaces(pagination: PaginationDto): Promise<PaginationResponseDto<PlaceDto>> {
        //Asignar valores predeterminados de paginación
        const limit = pagination.limit ?? 10
        const page = pagination.page ?? 10

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

        return {
            data: placesDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages
        }
    }

    async deleteAllData(): Promise<void> {
        await this.placeRepository.delete({})
    }

    async importData(file: Express.Multer.File): Promise<void> {
        const data = JSON.parse(file.buffer.toString())
        const elements = data.elements
        elements.forEach(async (element: any) => {
            const osmId = element.id.toString();
            const name = element.tags.name as string;
            const description = element.tags.description as string;
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
