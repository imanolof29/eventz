import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { EmailModule } from 'src/providers/email/email.module';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  imports: [
    AuthModule,
    EmailModule,
    TypeOrmModule.forFeature([Place])
  ]
})
export class PlacesModule { }
