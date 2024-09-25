import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { firebaseProvider } from './providers/firebase.provider';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [ConfigModule],
    providers: [firebaseProvider, NotificationsService],
    controllers: [NotificationsController],
    exports: [NotificationsService]
})
export class NotificationsModule { }
