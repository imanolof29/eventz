import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { User } from 'src/modules/users/user.entity';
import { Event } from 'src/modules/events/event.entity'
import { AuthModule } from 'src/modules/auth/auth.module';
import { StripeModule } from 'src/providers/stripe/stripe.module';
import { EmailModule } from 'src/providers/email/email.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Purchase, Event, User]),
    StripeModule,
    EmailModule
  ],
  providers: [PurchasesService],
  controllers: [PurchasesController]
})
export class PurchasesModule { }
