import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './modules/comment/comment.controller';
import { CommentService } from './modules/comment/comment.service';
import { CommentModule } from './modules/comment/comment.module';
import { PurchasesModule } from './modules/purchases/purchases.module';

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
    CommentModule,
    PurchasesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
