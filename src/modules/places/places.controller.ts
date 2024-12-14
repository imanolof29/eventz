import { Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PlaceDto } from './dto/place.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '../users/user.entity';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { MODULES, PERMISSIONS } from "../auth/role"


@ApiTags('places')
@Controller('places')
export class PlacesController {

    constructor(private readonly placesService: PlacesService) { }

    @Get('find')
    @ApiOperation({ summary: 'Get places' })
    @ApiResponse({ status: 200, description: 'Get places list' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.places, PERMISSIONS.list)
    async getPlaces(
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<PlaceDto>> {
        return this.placesService.getPlaces(paginationDto)
    }

    @Get('nearby')
    @CheckPermissions(MODULES.places, PERMISSIONS.list)
    async getPlacesNearPosition(
        @Query('lat') lat: number,
        @Query('lon') lon: number,
        @Query('radius') radius: number,
        @Query() paginationDto: PaginationDto
    ) {
        return this.placesService.getPlacesNearPosition({ lat, lon, radius, pagination: paginationDto })
    }

    @Get('pick/:id')
    @ApiOperation({ summary: 'Get place detail' })
    @ApiResponse({ status: 200, description: 'Get place detail' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.places, PERMISSIONS.detail)
    async pickPlace(@Param('id') id: string): Promise<PlaceDto> {
        return this.placesService.getPlaceById({ id })
    }

    @Post('import-data')
    @ApiOperation({ summary: 'Import data from .json file' })
    @ApiResponse({ status: 200, description: 'Import Ok' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @UseInterceptors(FileInterceptor('file'))
    @CheckPermissions(MODULES.places, PERMISSIONS.add)
    async importData(
        @UploadedFile() file: Express.Multer.File
    ) {
        return await this.placesService.importData(file)
    }

    @Delete('delete-data')
    @ApiOperation({ summary: 'Delete all data' })
    @ApiResponse({ status: 200, description: 'Delete all data' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.places, PERMISSIONS.delete)
    async deleteData() {
        return await this.placesService.deleteAllData()
    }

}
