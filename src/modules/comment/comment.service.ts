import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './comment.entity';
import { Event } from 'src/modules/events/event.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Place } from '../places/place.entity';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Place) private placeRepository: Repository<Event>
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
        const place = await this.commentRepository.findOneBy({ id: properties.dto.placeId })
        const newComment = await this.commentRepository.create({
            user,
            place,
            content: properties.dto.content
        })
        await this.commentRepository.save(newComment)
    }

    async deleteComment(properties: { commentId: string, placeId: string }): Promise<void> {
        const place = await this.placeRepository.findOneBy({ id: properties.placeId })
        const comment = await this.commentRepository.findOneBy({
            id: properties.commentId,
            place
        })
        await this.commentRepository.delete(comment)
    }

}
