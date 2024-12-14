import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';

import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/modules/users/user.entity';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { MODULES, PERMISSIONS } from '../auth/role';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create new category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: 'Category created' })
    @CheckPermissions(MODULES.categories, PERMISSIONS.add)
    async createCategory(@Body() dto: CreateCategoryDto): Promise<void> {
        return this.categoriesService.createCategory({ dto })
    }

    @Get('find')
    @ApiOperation({ summary: 'Get category list' })
    @ApiResponse({ status: 200, description: 'Category list' })
    @CheckPermissions(MODULES.categories, PERMISSIONS.list)
    async getCategories(
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<CategoryDto>> {
        return this.categoriesService.getCategories(paginationDto)
    }

    @Get('pick/:id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'Category details' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @CheckPermissions(MODULES.categories, PERMISSIONS.detail)
    async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
        return this.categoriesService.getCategoryById({ id })
    }

    @Delete('delete/:id')
    @ApiResponse({ status: 200, description: 'Category deleted' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permissions' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @CheckPermissions(MODULES.categories, PERMISSIONS.delete)
    async deleteCategory(@Param('id') id: string) {
        return this.categoriesService.deleteCategory({ id })
    }

    @Put('update/:id')
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'Category updated' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @CheckPermissions(MODULES.categories, PERMISSIONS.edit)
    async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.updateCategory({ id, dto })
    }


}
