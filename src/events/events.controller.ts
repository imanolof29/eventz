import { Body, Controller, Delete, Get, Param, ParseFloatPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDto } from './dto/event.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

@ApiTags('events')
@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create new event' })
    @ApiBody({ type: CreateEventDto })
    @ApiResponse({ status: 201, description: 'Event created' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @Auth()
    async createEvent(@Body() dto: CreateEventDto, @GetUser() user: User): Promise<void> {
        return this.eventsService.createEvent({ dto, userId: user.id })
    }

    @Get('find')
    @ApiOperation({ summary: 'Get events' })
    @ApiResponse({ status: 200, description: 'Get event list' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async getEvents(): Promise<EventDto[]> {
        return this.eventsService.getEvents()
    }

    @Get('findNearby')
    @Auth()
    async getNearbyEvents(
        @Query('latitude', ParseFloatPipe) latitude: number,
        @Query('longitude', ParseFloatPipe) longitude: number,
        @Query('radius', ParseIntPipe) radius: number
    ): Promise<void> {
        return this.eventsService.getNearbyEvents({ radius, latitude, longitude })
    }

    @Get('pick/:id')
    @ApiOperation({ summary: 'Get event by id' })
    @ApiParam({ name: 'id', required: true, description: 'Event id' })
    @ApiResponse({ status: 200, description: 'Event detail' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async pickEvent(@Param('id') id: string): Promise<EventDto> {
        return this.eventsService.getEventById({ id })
    }

    @Put('update/:id')
    @ApiOperation({ summary: 'Event updated' })
    @ApiParam({ name: 'id', required: true, description: 'Event id' })
    @ApiResponse({ status: 201, description: 'Event updated' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
        return this.eventsService.updateEvent({ id, dto })
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Event deleted' })
    @ApiParam({ name: 'id', required: true, description: 'Event id' })
    @ApiResponse({ status: 204, description: 'Event deleted' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async deleteEvent(@Param('id') id: string) {
        return this.eventsService.deleteEvent({ id })
    }

}
