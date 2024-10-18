import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './comment.entity';
import { Event } from 'src/events/event.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Event) private eventRepository: Repository<Event>
    ) { }

    async getEventComments(properties: { id: string }): Promise<CommentDto[]> {
        const comments = await this.commentRepository.find({
            where: {
                id: properties.id
            },
            relations: ['user']
        })
        return comments.map((comment) => new CommentDto({
            userId: comment.user.id,
            content: comment.content
        }))
    }

    async createComment(properties: { dto: CreateCommentDto, userId: string }): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        const event = await this.commentRepository.findOneBy({ id: properties.dto.eventId })
        const newComment = await this.commentRepository.create({
            user,
            event,
            content: properties.dto.content
        })
        await this.commentRepository.save(newComment)
    }

    async deleteComment(properties: { commentId: string, eventId: string }): Promise<void> {
        const event = await this.eventRepository.findOneBy({ id: properties.eventId })
        const comment = await this.commentRepository.findOneBy({
            id: properties.commentId,
            event
        })
        await this.commentRepository.delete(comment)
    }

}
