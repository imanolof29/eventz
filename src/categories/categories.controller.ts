import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

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

    @Delete('delete/:id')
    @Auth(UserRole.ADMIN)
    async deleteCategory(@Param('id') id: string) {
        return this.categoriesService.deleteCategory({ id })
    }


}
