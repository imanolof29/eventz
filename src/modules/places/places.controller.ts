import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PlaceDto } from './dto/place.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

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

}
