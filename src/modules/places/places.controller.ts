import { Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PlaceDto } from './dto/place.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '../users/user.entity';


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

    @Post('import-data')
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

}
