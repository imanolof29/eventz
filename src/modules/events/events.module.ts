import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/modules/categories/category.entity';
import { Event } from './event.entity';
import { User } from 'src/modules/users/user.entity';
import { Organization } from '../organizations/organization.entity';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [AuthModule, TypeOrmModule.forFeature([Event, Category, Organization, User])]
})
export class EventsModule { }
