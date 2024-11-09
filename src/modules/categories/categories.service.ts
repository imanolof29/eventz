import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CATEGORY_NOT_FOUND } from 'src/errors/errors.constants';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

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

    async getCategories(pagination: PaginationDto): Promise<PaginationResponseDto<CategoryDto>> {
        //Asignar valores predeterminados de paginación
        const limit = pagination.limit ?? 10
        const page = pagination.page ?? 0

        //Obtener categorias y total de registros usando paginación
        const [categories, total] = await this.categoryRepository.findAndCount({
            skip: limit * page,
            take: limit,
            order: {
                "created": 'desc'
            },
        })

        // Calcular el número total de páginas
        const totalPages = Math.ceil(total / limit);

        const categoriesDto = categories.map(
            (category) => new CategoryDto({
                id: category.id,
                name: category.name,
                created: category.created
            })
        )

        return {
            data: categoriesDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages
        }

    }

    async getCategoryById(properties: { id: string }): Promise<CategoryDto> {
        const category = await this.categoryRepository.findOneBy({
            id: properties.id
        })
        if (!category) {
            throw new HttpException(CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)
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
            throw new HttpException(CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        const updatedCategory = Object.assign(category, properties.dto)
        return this.categoryRepository.save(updatedCategory)
    }

}
