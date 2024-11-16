import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { User } from 'src/modules/users/user.entity';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';

//TODO: Darle una vuelta al planteamiento de los params y body

@ApiTags('comments')
@Controller('comments')
export class CommentController {

    constructor(private readonly commentService: CommentService) { }

    @Get('find/:id')
    @ApiOperation({ summary: 'Get event comments' })
    @ApiResponse({ status: 200, description: 'Get comments' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Auth()
    async getEventComments(@Param('id') id: string): Promise<CommentDto[]> {
        return this.commentService.getEventComments({ id })
    }

    @Post('create')
    @ApiOperation({ summary: 'Create comment' })
    @ApiResponse({ status: 201, description: 'Comment created' })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    @ApiResponse({ status: 403, description: 'Not permission' })
    @Auth()
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
    @Auth()
    async deleteComment(@Body() commentId: string, @Param('id') id: string): Promise<void> {
        return this.commentService.deleteComment({ commentId, placeId: id })
    }


}
