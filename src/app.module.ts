import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AuthModule, EventsModule, CategoriesModule],
  controllers: [EventsController, CategoriesController],
  providers: [CategoriesService],
})
export class AppModule { }
