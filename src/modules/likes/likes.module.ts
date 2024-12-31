import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './post-like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PostLike, Post, User])
  ]
})
export class LikesModule { }
