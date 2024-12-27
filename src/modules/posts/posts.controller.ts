import { Controller, Get, Param, Query, Post, Body, UploadedFile, ParseFilePipe, MaxFileSizeValidator } from "@nestjs/common";
import { PaginationResponseDto } from "../common/dto/pagination.response.dto";
import { PostDto } from "./dto/post.dto";
import { PostsService } from "./posts.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "../users/user.entity";

@Controller('posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService
    ) { }

    @Get('posts/:id')
    async getPlacePosts(
        @Query() paginationDto: PaginationDto,
        @Param('id') id: string
    ): Promise<PaginationResponseDto<PostDto>> {
        return this.postsService.getPlacePosts({ pagination: paginationDto, id })
    }

    @Post('posts/:id')
    async createPlacePost(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 10000000 })],
            }),
        ) file: Express.Multer.File,
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<void> {
        return this.postsService.createPost({ placeId: id, userId: user.id, file })
    }

}