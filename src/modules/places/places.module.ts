import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Place])
  ]
})
export class PlacesModule { }
