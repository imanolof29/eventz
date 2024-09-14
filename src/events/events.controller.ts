import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDto } from './dto/event.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from '@prisma/client';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) { }

    @Post('create')
    @Auth()
    async createEvent(@Body() dto: CreateEventDto, @GetUser() user: User): Promise<void> {
        return this.eventsService.createEvent({ dto, userId: user.id })
    }

    @Get('find')
    async getEvents(): Promise<EventDto[]> {
        return this.eventsService.getEvents()
    }

    @Get('pick/:id')
    async pickEvent(@Param('id') id: string): Promise<EventDto> {
        return this.eventsService.getEventById({ id })
    }

    @Put('update/:id')
    async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
        return this.eventsService.updateEvent({ id, dto })
    }

    @Delete('delete/:id')
    async deleteEvent(@Param('id') id: string) {
        return this.eventsService.deleteEvent({ id })
    }

}
