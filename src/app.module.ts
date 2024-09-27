import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'imanolortiz',
      password: '',
      database: 'eventztype',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    ConfigModule.forRoot(),
    AuthModule,
    EventsModule,
    CategoriesModule,
    UsersModule,
    NotificationsModule,
  ],
})
export class AppModule { }
