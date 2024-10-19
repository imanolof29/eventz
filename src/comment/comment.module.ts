import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [CommentController],
    providers: [CommentService],
    imports: [AuthModule, TypeOrmModule.forFeature([Comment, User, Event])]
})
export class CommentModule { }
