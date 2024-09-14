import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [CategoriesController],
    providers: [CategoriesService, PrismaService],
    imports: [AuthModule]
})
export class CategoriesModule { }
