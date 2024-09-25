import { ConfigService } from "@nestjs/config";
import * as admin from 'firebase-admin';

export const firebaseProvider = {
    provide: 'FIREBASE_APP',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const firebaseConfig = {
            projectId: configService.get<string>('PROJECT_ID'),
            clientEmail: configService.get<string>('CLIENT_EMAIL'),
            privateKey: configService.get<string>('PRIVATE_KEY')
        } as admin.ServiceAccount;

        return admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig)
        })

    }
}