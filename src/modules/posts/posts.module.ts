import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from "./post.entity"
import { User } from '../users/user.entity';
import { Place } from '../places/place.entity';
import { S3Module } from 'src/providers/s3/s3.module';

@Module({
    controllers: [PostsController],
    providers: [PostsService],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Post, Place, User]),
        S3Module
    ]
})
export class PostsModule { }
