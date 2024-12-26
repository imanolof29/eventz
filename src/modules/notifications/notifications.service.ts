import { Inject, Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { app } from 'firebase-admin'
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {

    private messaging: Messaging

    private expo: Expo

    constructor(
        @Inject('FIREBASE_APP') private firebaseApp: app.App,
        @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
    ) {
        this.messaging = firebaseApp.messaging()
        this.expo = new Expo()
    }

    async sendNotification(title: string, body: string, token: string) {
        const messages: ExpoPushMessage[] = [];

        // Prepara los mensajes
        if (!Expo.isExpoPushToken(token)) {
            return
        }

        messages.push({
            to: token,
            sound: 'default',
            title,
            body,
            data: {
                title: 'Hello',
            },
        });


        if (messages.length === 0) {
            return;
        }

        // Divide los mensajes en lotes
        const chunks = this.expo.chunkPushNotifications(messages);

        // Enviar cada lote
        for (const chunk of chunks) {
            try {
                await this.expo.sendPushNotificationsAsync(chunk);
            } catch (error) {
                console.log(error)
            }
        }
    }

    async getUserNotifications(properties: { userId: string, pagination: PaginationDto }): Promise<PaginationResponseDto<NotificationDto>> {
        try {

            const limit = properties.pagination.limit ?? 10;
            const page = properties.pagination.page ?? 0;

            const [notifications, total] = await this.notificationRepository.findAndCount({
                where: {
                    user: {
                        id: properties.userId
                    },
                },
                order: {
                    created: 'DESC',
                },
            })

            const totalPages = Math.ceil(total / limit);

            const notificationsDto = notifications.map((notification) => {
                return new NotificationDto({
                    id: notification.id,
                    userId: notification.user.id,
                    title: notification.title,
                    message: notification.message,
                    read: notification.read,
                    created: notification.created
                })
            })

            return {
                data: notificationsDto,
                total,
                page: Math.floor(page / limit) + 1,
                limit,
                totalPages
            }

        } catch (error) {
            console.log(error)
            throw error
        }
    }

}
