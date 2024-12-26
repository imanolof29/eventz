import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { User } from '../users/user.entity';
import { S3Module } from 'src/providers/s3/s3.module';
import { Place } from '../places/place.entity';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [AuthModule, TypeOrmModule.forFeature([Organization, User, Place]), S3Module]
})
export class OrganizationsModule { }
