import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {

    constructor(private prisma: PrismaService) { }

    async createCategory(properties: { dto: CreateCategoryDto }) {
        await this.prisma.category.create({
            data: {
                name: properties.dto.name
            }
        })
    }

    async getCategories(): Promise<CategoryDto[]> {
        const categories = await this.prisma.category.findMany()
        return categories.map(
            (category) => new CategoryDto({
                id: category.id,
                name: category.name,
                created: category.created
            })
        )
    }

    async deleteCategory(properties: { id: string }) {
        return await this.prisma.category.delete({
            where: {
                id: properties.id
            }
        })
    }

}
