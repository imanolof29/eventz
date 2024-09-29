import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';

@Module({
    controllers: [CategoriesController],
    providers: [CategoriesService, PrismaService],
    imports: [AuthModule, TypeOrmModule.forFeature([Category])]
})
export class CategoriesModule { }
