import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create.purchase.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { User } from 'src/modules/users/user.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {

    constructor(private readonly purchaseService: PurchasesService) { }

    @Post('purchase')
    @ApiOperation({ summary: 'Purchase event ticket' })
    @Auth()
    async purchase(@Body() dto: CreatePurchaseDto, @GetUser() user: User): Promise<void> {
        return this.purchaseService.purchase(user.id, dto.eventId, dto.quantity)
    }

    @Get('find')
    @ApiOperation({ summary: 'List users purchases' })
    @Auth()
    async getUserPurchases(
        @Query() paginationDto: PaginationDto,
        @GetUser() user: User
    ): Promise<PaginationResponseDto<PurchaseDto>> {
        return this.purchaseService.getUserPurchases({ pagination: paginationDto, userId: user.id })
    }

    @Get('pick/:id')
    @ApiOperation({ summary: 'Pick user purchase' })
    @Auth()
    async getPurchaseDetail(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<PurchaseDto> {
        return this.purchaseService.getPurchaseById({ id, userId: user.id })
    }

    @Post('check-purchase')
    async checkPurchaseIsValid(
        @Param('buyerId') buyerId: string,
        @Param('purchaseId') purchaseId: string
    ): Promise<void> {
        return this.purchaseService.checkPurchaseIsValid({ purchaseId, buyerId })
    }

}
