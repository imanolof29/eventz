import { Body, Controller, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { OrganizationDto } from './dto/organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {

    constructor(private readonly organizationService: OrganizationsService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create new organization' })
    @ApiBody({ type: CreateOrganizationDto })
    @ApiResponse({ status: 201, description: 'Organization created' })
    @Auth()
    async createOrganization(@Body() dto: CreateOrganizationDto): Promise<void> {
        return await this.organizationService.createOrganization(dto)
    }

    @Get('find')
    @ApiOperation({ summary: 'Get organizations' })
    @ApiResponse({ status: 200, description: 'Get organization list' })
    @Auth()
    async getOrganizations(
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<OrganizationDto>> {
        return await this.organizationService.getOrganizations(paginationDto)
    }

    @Get('pick/:id')
    @Auth()
    async pickOrganization(@Param('id') id: string): Promise<OrganizationDto> {
        return await this.organizationService.getOrganizationById(id)
    }

    @Put('update/:id')
    @Auth()
    async updateOrganization(
        @Param('id') id: string,
        @Body() dto: UpdateOrganizationDto
    ): Promise<void> {
        return await this.organizationService.updateOrganization(id, dto)
    }

    @Post('logo')
    @ApiOperation({ summary: 'Update organization logo' })
    @ApiResponse({ status: 201, description: 'Image uploaded' })
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
