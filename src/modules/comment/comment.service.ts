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
import { S3Service } from 'src/providers/s3/s3.service';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Place) private placeRepository: Repository<Event>,
        private readonly s3Service: S3Service
    ) { }

    async getPlaceComments(
        pagination: PaginationDto,
        id: string
    ): Promise<PaginationResponseDto<CommentDto>> {
        // Extraer y definir valores de paginación con destructuring
        const { limit = 10, page = 0 } = pagination;

        // Usar QueryBuilder para optimizar la consulta
        const queryBuilder = this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .where('comment.place.id = :id', { id })
            .orderBy('comment.created', 'DESC')
            .skip(limit * page)
            .take(limit);

        // Ejecutar la consulta y obtener resultados
        const [comments, total] = await queryBuilder.getManyAndCount();

        // Preparar las URLs presignadas en batch
        const profileImageKeys = comments
            .map(comment => comment.user.profileImage)
            .filter(key => key !== null);

        // Generar todas las URLs presignadas en paralelo
        const presignedUrls = profileImageKeys.length > 0
            ? await Promise.all(
                profileImageKeys.map(key =>
                    this.s3Service.getPresignedUrl(key, 'profile.jpg')
                )
            )
            : [];

        // Crear un Map para acceso rápido a las URLs
        const urlMap = new Map<string, string>();
        profileImageKeys.forEach((key, index) => {
            urlMap.set(key, presignedUrls[index]);
        });

        // Mapear los comentarios a DTOs
        const commentsDto = comments.map(comment => ({
            id: comment.id,
            user: new UserDto({
                id: comment.user.id,
                firstName: comment.user.firstName,
                lastName: comment.user.lastName,
                email: comment.user.email,
                username: comment.user.username,
                profile: comment.user.profileImage
                    ? urlMap.get(comment.user.profileImage)
                    : null,
                created: comment.user.created
            }),
            content: comment.content,
            created: comment.created
        }));

        return {
            data: commentsDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }


    async createComment(properties: { dto: CreateCommentDto, placeId: string, userId: string }): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        const place = await this.placeRepository.findOneBy({ id: properties.placeId })
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
