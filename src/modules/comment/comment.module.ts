import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { User } from 'src/modules/users/user.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Place } from '../places/place.entity';
import { S3Module } from 'src/providers/s3/s3.module';

@Module({
    controllers: [CommentController],
    providers: [CommentService],
    imports: [AuthModule, TypeOrmModule.forFeature([Comment, User, Place]), S3Module]
})
export class CommentModule { }
