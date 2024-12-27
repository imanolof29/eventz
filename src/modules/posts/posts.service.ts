import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { Repository } from "typeorm";
import { Place } from "../places/place.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { PostDto } from "./dto/post.dto";
import { S3Service } from "src/providers/s3/s3.service";
import { User } from "../users/user.entity";
import { PLACE_NOT_FOUND, USER_NOT_FOUND } from "src/errors/errors.constants";

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Post) private readonly postRepository: Repository<Post>,
        @InjectRepository(Place) private readonly placeRepository: Repository<Place>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly s3Service: S3Service
    ) { }

    async getPlacePosts(properties: { pagination: PaginationDto, id: string }) {
        const limit = properties.pagination.limit ?? 10
        const page = properties.pagination.page ?? 0

        const [posts, total] = await this.postRepository.findAndCount({
            skip: limit * page,
            take: limit,
            where: {
                place: {
                    id: properties.id
                }
            }
        })

        const totalPages = Math.ceil(total / limit)

        const postsDto = posts.map((post) => new PostDto({
            id: post.id,
            photo: post.photo
        }))

        return {
            data: postsDto,
            total,
            page: Math.floor(page / limit) + 1,
            limit,
            totalPages
        }
    }

    async createPost(properties: { userId: string, placeId: string, file: Express.Multer.File }): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: properties.userId })
        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND)
        }
        const place = await this.placeRepository.findOneBy({ id: properties.placeId })
        if (!place) {
            throw new NotFoundException(PLACE_NOT_FOUND)
        }
        const result = await this.s3Service.upload(properties.file)
        const post = await this.postRepository.create({
            user,
            place,
            photo: result.Key
        })
        await this.postRepository.save(post)
    }

}