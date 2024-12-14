import { Body, Controller, Get, Post } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create.purchase.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { User } from 'src/modules/users/user.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    async getUserPurchases(@GetUser() user: User): Promise<PurchaseDto[]> {
        return this.purchaseService.getUserPurchases({ userId: user.id })
    }


}
