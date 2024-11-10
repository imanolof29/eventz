import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';

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

}
