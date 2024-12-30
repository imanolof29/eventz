import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { User } from 'src/modules/users/user.entity';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';

@ApiTags('places/:placeId/comments')
@Controller('comments')
export class CommentController {

    constructor(private readonly commentService: CommentService) { }

    @Get('find')
    @ApiOperation({ summary: 'Get place comments' })
    @ApiOkResponse({ description: 'Get comments', type: CommentDto, isArray: true })
    @ApiBadRequestResponse({ description: "Invalid data provided" })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async getPlaceComments(
        @Param('placeId') id: string,
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<CommentDto>> {
        return this.commentService.getPlaceComments(paginationDto, id)
    }

    @Post('create')
    @ApiOperation({ summary: 'Create comment' })
    @ApiCreatedResponse({ description: 'Comment created successfully' })
    @ApiBadRequestResponse({ description: "Invalid data provided" })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @Auth()
    async createComment(@Body() dto: CreateCommentDto, @GetUser() user: User): Promise<void> {
        return this.commentService.createComment({ dto, userId: user.id })
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Delete comment' })
    @ApiOkResponse({ description: "Comment deleted" })
    @ApiUnauthorizedResponse({ description: 'Not authenticated' })
    @ApiForbiddenResponse({ description: 'Not permission' })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async deleteComment(
        @Param('placeId') placeId: string,
        @Param('id') commentId: string): Promise<void> {
        return this.commentService.deleteComment({ commentId, placeId })
    }


}
