import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDto } from './dto/event.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from '@prisma/client';

@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) { }

    @Get('find')
    @Auth()
    async createEvent(@Body() dto: CreateEventDto, @GetUser() user: User): Promise<void> {
        return this.eventsService.createEvent({ dto, userId: user.id })
    }

    @Post('create')
    async getEvents(): Promise<EventDto[]> {
        return this.eventsService.getEvents()
    }

    @Delete('delete/:id')
    async deleteEvent(@Param('id') id: string) {
        return this.eventsService.deleteEvent({ id })
    }

}
