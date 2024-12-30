import { Controller, Get, Param, Query, Post, UploadedFile, ParseFilePipe, MaxFileSizeValidator } from "@nestjs/common";
import { PaginationResponseDto } from "../common/dto/pagination.response.dto";
import { PostDto } from "./dto/post.dto";
import { PostsService } from "./posts.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "../users/user.entity";
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Auth } from "../auth/decorators/auth.decorator";

@ApiTags('posts')
@Controller('places/:placeId/posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService
    ) { }

    @Get('posts')
    @ApiOperation({ summary: 'Get place posts' })
    @ApiOkResponse({ description: 'Get place posts', type: PostDto, isArray: true })
    @ApiBadRequestResponse({ description: "Invalid data provided" })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiForbiddenResponse({ description: 'Not permission' })
    @Auth()
    async getPlacePosts(
        @Query() paginationDto: PaginationDto,
        @Param('placeId') placeId: string
    ): Promise<PaginationResponseDto<PostDto>> {
        return this.postsService.getPlacePosts({ pagination: paginationDto, placeId })
    }

    @Post('posts')
    @ApiOperation({ summary: 'Create post of place' })
    @ApiOkResponse({ description: "Post created successfully" })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiForbiddenResponse({ description: 'Not permission' })
    @Auth()
    async createPlacePost(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 10000000 })],
            }),
        ) file: Express.Multer.File,
        @Param('placeId') placeId: string,
        @GetUser() user: User
    ): Promise<void> {
        return this.postsService.createPost({ placeId, userId: user.id, file })
    }

}