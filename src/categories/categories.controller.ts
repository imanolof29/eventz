import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';

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



}
