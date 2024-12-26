import { Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PlaceDto } from './dto/place.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '../users/user.entity';
import { LocationDto } from './dto/location.dto';
import axios from 'axios';


@ApiTags('places')
@Controller('places')
export class PlacesController {

    constructor(private readonly placesService: PlacesService) { }

    @Get('find')
    @ApiOperation({ summary: 'Get places' })
    @ApiResponse({ status: 200, description: 'Get places list' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async getPlaces(
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<PlaceDto>> {
        return this.placesService.getPlaces(paginationDto)
    }

    @Get('nearby')
    async getPlacesNearPosition(
        @Query('lat') lat: number,
        @Query('lon') lon: number,
        @Query('radius') radius: number,
        @Query('query') query: string,
        @Query() paginationDto: PaginationDto
    ) {
        return this.placesService.getPlacesNearPosition({ lat, lon, radius, query, pagination: paginationDto })
    }

    @Get('pick/:id')
    @ApiOperation({ summary: 'Get place detail' })
    @ApiResponse({ status: 200, description: 'Get place detail' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async pickPlace(@Param('id') id: string): Promise<PlaceDto> {
        return this.placesService.getPlaceById({ id })
    }

    @Post('import-data')
    @ApiOperation({ summary: 'Import data from .json file' })
    @ApiResponse({ status: 200, description: 'Import Ok' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @UseInterceptors(FileInterceptor('file'))
    @Auth(UserRole.ADMIN)
    async importData(
        @UploadedFile() file: Express.Multer.File
    ) {
        return await this.placesService.importData(file)
    }

    @Delete('delete-data')
    @ApiOperation({ summary: 'Delete all data' })
    @ApiResponse({ status: 200, description: 'Delete all data' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth(UserRole.ADMIN)
    async deleteData() {
        return await this.placesService.deleteAllData()
    }

    @Get('geocoding')
    @Auth()
    async getLocation(
        @Query('lat') lat: number,
        @Query('lon') lon: number,
    ): Promise<LocationDto> {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
            const location = response.data.address.city ||
                response.data.address.town ||
                response.data.address.village ||
                response.data.address.municipality ||
                response.data.address.suburb ||
                response.data.address.hamlet ||
                response.data.address.locality ||
                response.data.address.county ||
                'Ubicación desconocida';
            const data = new LocationDto({
                latitude: response.data.lat,
                longitude: response.data.lon,
                name: location
            })
            return data
        } catch (err) {
            console.log(err)
            throw err
        }
    }

}
