import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { NotificationDto } from './dto/notification.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {

    constructor(private readonly notificationService: NotificationsService) { }


    @Post('send')
    async sendNotification(
        @Body('token') token: string,
        @Body('title') title: string,
        @Body('body') body: string
    ): Promise<void> {
        return this.notificationService.sendNotification(title, body, token)
    }

    @Get('my-notifications')
    @Auth()
    async getUserNotifications(
        @GetUser() user: User,
        @Query() pagination: PaginationDto
    ): Promise<PaginationResponseDto<NotificationDto>> {
        return this.notificationService.getUserNotifications({
            userId: user.id,
            pagination
        })
    }

}
