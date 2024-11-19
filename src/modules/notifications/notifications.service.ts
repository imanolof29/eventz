import { Inject, Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { app } from 'firebase-admin'
import { Messaging } from 'firebase-admin/lib/messaging/messaging';

@Injectable()
export class NotificationsService {

    private messaging: Messaging

    private expo: Expo

    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
        this.messaging = firebaseApp.messaging()
        this.expo = new Expo()
    }

    //FIREBASE NOTIFICATIONS
    // sendNotification(title: string, body: string, token: string) {
    //     const payload = {
    //         notification: {
    //             title,
    //             body
    //         },
    //         token
    //     }
    //     this.messaging.send(payload).then((response) => {
    //         console.log("NOTIFICATION SENT ", response)
    //     }).catch(e => {
    //         console.log("ERROR SENDING NOTIFICATION ", e)
    //     })
    // }

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

}
