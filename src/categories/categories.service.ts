import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) { }

    async createCategory(properties: { dto: CreateCategoryDto }) {
        const newCategory = await this.categoryRepository.create({
            name: properties.dto.name
        })
        await this.categoryRepository.save(newCategory)
    }

    async getCategories(): Promise<CategoryDto[]> {
        const categories = await this.categoryRepository.find()
        return categories.map(
            (category) => new CategoryDto({
                id: category.id,
                name: category.name,
                created: category.created
            })
        )
    }

    async getCategoryById(properties: { id: string }): Promise<CategoryDto> {
        const category = await this.categoryRepository.findOneBy({
            id: properties.id
        })
        if (!category) {
            console.log("NOT FOUND")
        }
        return new CategoryDto({
            id: category.id,
            name: category.name,
            created: category.created
        })
    }

    async deleteCategory(properties: { id: string }) {
        await this.categoryRepository.delete({
            id: properties.id
        })
    }

    async updateCategory(properties: { id: string; dto: UpdateCategoryDto }) {
        const category = await this.categoryRepository.findOneBy({ id: properties.id })
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
        }
        const updatedCategory = Object.assign(category, properties.dto)
        return this.categoryRepository.save(updatedCategory)
    }

}
