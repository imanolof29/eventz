import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
    controllers: [CommentController],
    providers: [CommentService],
    imports: [TypeOrmModule.forFeature([Comment])]
})
export class CommentModule { }
