import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaService } from 'src/prisma.service';
import { EventsController } from './events.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
  imports: [AuthModule]
})
export class EventsModule { }
