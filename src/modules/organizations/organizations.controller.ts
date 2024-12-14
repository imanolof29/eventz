import { Body, Controller, Get, MaxFileSizeValidator, ParseFilePipe, Post, Query, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { OrganizationDto } from './dto/organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {

    constructor(private readonly organizationService: OrganizationsService) { }

    @Post('logo')
    @Auth()
    async createOrganization(@Body() dto: CreateOrganizationDto): Promise<void> {
        return await this.organizationService.createOrganization(dto)
    }

    @Get('find')
    @Auth()
    async getOrganizations(
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<OrganizationDto>> {
        return await this.organizationService.getOrganizations(paginationDto)
    }

    @Post('logo')
    @Auth()
    async uploadLogoImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 10000000 })]
            })
        ) file: Express.Multer.File,
        organizationId: string
    ) {
        return await this.organizationService.updateLogo(file, organizationId)
    }

}
