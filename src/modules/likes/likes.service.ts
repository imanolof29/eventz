import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from './post-like.entity';
import { Repository } from 'typeorm';
import { Post } from '../posts/post.entity';
import { POST_NOT_FOUND, USER_NOT_FOUND } from 'src/errors/errors.constants';
import { User } from '../users/user.entity';

@Injectable()
export class LikesService {

    constructor(
        @InjectRepository(PostLike) private readonly postLikeRepository: Repository<PostLike>,
        @InjectRepository(Post) private readonly postRepository: Repository<Post>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async createPostLike(properties: { userId: string, postId: string }) {
        const post = await this.postRepository.findOneBy({ id: properties.postId })
        if (!post) {
            throw new NotFoundException(POST_NOT_FOUND)
        }
        const user = await this.userRepository.findOneBy({ id: properties.userId })

        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND)
        }

        const userGaveLike = await this.postLikeRepository.findOne({
            where: {
                user: {
                    id: user.id
                },
                post: {
                    id: post.id
                }
            }
        })
        if (userGaveLike) {
            throw new BadRequestException("USER ALREADY GAVE LIKE")
        }
        const newLike = await this.postLikeRepository.create({
            user,
            post
        })
        await this.postLikeRepository.save(newLike)
    }

    async deletePostLike(properties: { id: string, userId: string, postId: string }) {
        const user = await this.userRepository.findOneBy({ id: properties.id })
        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND)
        }
        const post = await this.postRepository.findOneBy({ id: properties.postId })
        if (!post) {
            throw new NotFoundException(POST_NOT_FOUND)
        }
        const postLike = await this.postLikeRepository.findOne({
            where: {
                post: {
                    id: post.id,
                },
                user: {
                    id: user.id
                },
                id: properties.id
            }
        })
        await this.postLikeRepository.delete(postLike)
    }

}
