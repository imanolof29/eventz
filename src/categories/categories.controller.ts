import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Post('create')
    async createCategory(@Body() dto: CreateCategoryDto): Promise<void> {
        return this.categoriesService.createCategory({ dto })
    }

    @Get('find')
    async getCategories(): Promise<CategoryDto[]> {
        return this.categoriesService.getCategories()
    }

    @Get('pick/:id')
    async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
        return this.categoriesService.getCategoryById({ id })
    }

    @Delete('delete/:id')
    @Auth(UserRole.ADMIN)
    async deleteCategory(@Param('id') id: string) {
        return this.categoriesService.deleteCategory({ id })
    }

    @Put('update/:id')
    async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.updateCategory({ id, dto })
    }


}
