import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin'
import { Messaging } from 'firebase-admin/lib/messaging/messaging';

@Injectable()
export class NotificationsService {

    messaging: Messaging

    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
        this.messaging = firebaseApp.messaging()
    }

    sendNotification(title: string, body: string, token: string) {
        const payload = {
            notification: {
                title,
                body
            },
            token
        }
        this.messaging.send(payload).then((response) => {
            console.log("NOTIFICATION SENT ", response)
        }).catch(e => {
            console.log("ERROR SENDING NOTIFICATION ", e)
        })
    }

}
