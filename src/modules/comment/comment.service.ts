import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './comment.entity';
import { Event } from 'src/modules/events/event.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Place } from '../places/place.entity';
import { UserDto } from '../users/dto/user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Place) private placeRepository: Repository<Event>
    ) { }

    async getPlaceComments(
        pagination: PaginationDto,
        id: string
    ): Promise<PaginationResponseDto<CommentDto>> {

        //Asignar valores predeterminados de paginación
        const limit = pagination.limit ?? 10
        const page = pagination.page ?? 0

        //Obtener comentarios y total de registros usando paginación
        const [comments, total] = await this.commentRepository.findAndCount({
            skip: limit * page,
            take: limit,
            order: {
                created: 'DESC'
            },
            where: {
                place: {
                    id
                }
            },
            relations: ['user']
        })

        //Calcular el número total de páginas
        const totalPages = Math.ceil(total / limit)

        const commentsDto = comments.map((comment) => new CommentDto({
            id: comment.id,
            user: new UserDto({
                id: comment.user.id,
                firstName: comment.user.firstName,
                lastName: comment.user.lastName,
                email: comment.user.email,
                username: comment.user.username,
                created: comment.user.created
            }),
            content: comment.content,
            created: comment.created
        }))

        return {
            data: commentsDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages
        }

    }

    async createComment(properties: { dto: CreateCommentDto, userId: string }): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        const place = await this.placeRepository.findOneBy({ id: properties.dto.placeId })
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
