import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { User } from 'src/modules/users/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { MODULES, PERMISSIONS } from '../auth/role';

//TODO: Darle una vuelta al planteamiento de los params y body

@ApiTags('comments')
@Controller('comments')
export class CommentController {

    constructor(private readonly commentService: CommentService) { }

    @Get('find/:id')
    @ApiOperation({ summary: 'Get event comments' })
    @ApiResponse({ status: 200, description: 'Get comments' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.comments, PERMISSIONS.list)
    async getPlaceComments(
        @Param('id') id: string,
        @Query() paginationDto: PaginationDto
    ): Promise<PaginationResponseDto<CommentDto>> {
        return this.commentService.getPlaceComments(paginationDto, id)
    }

    @Post('create')
    @ApiOperation({ summary: 'Create comment' })
    @ApiResponse({ status: 201, description: 'Comment created' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @CheckPermissions(MODULES.comments, PERMISSIONS.add)
    async createComment(@Body() dto: CreateCommentDto, @GetUser() user: User): Promise<void> {
        return this.commentService.createComment({ dto, userId: user.id })
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Delete comment' })
    @ApiResponse({ status: 200, description: 'Delete comment' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @CheckPermissions(MODULES.comments, PERMISSIONS.delete)
    async deleteComment(@Body() commentId: string, @Param('id') id: string): Promise<void> {
        return this.commentService.deleteComment({ commentId, placeId: id })
    }


}
