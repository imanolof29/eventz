import { Controller, Delete, Param, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('places/:placeId/posts/:postId/likes')
export class LikesController {

    constructor(
        private readonly postLikeService: LikesService
    ) { }

    @Post('create')
    @Auth()
    async createPostLike(
        @Param('postId') postId: string,
        @GetUser() user: User
    ) {
        return this.postLikeService.createPostLike({ postId, userId: user.id })
    }

    @Delete('delete/:id')
    async deletePostLike(
        @Param('postId') postId: string,
        @Param('id') id: string,
        @GetUser() user: User
    ) {
        return this.postLikeService.deletePostLike({ postId, id, userId: user.id })
    }

}
