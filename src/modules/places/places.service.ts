import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { Repository } from 'typeorm';
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
            description: place.description
        }))

        return {
            data: placesDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages
        }
    }

    async importData(file: Express.Multer.File): Promise<void> { }

}
