import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { User } from 'src/modules/users/user.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Purchase, Event, User])],
  providers: [PurchasesService],
  controllers: [PurchasesController]
})
export class PurchasesModule { }
