import { Body, Controller, Get, Post } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create.purchase.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { PurchaseDto } from './dto/purchase.dto';

@Controller('purchases')
export class PurchasesController {

    constructor(private readonly purchaseService: PurchasesService) { }

    @Post('purchase')
    async purchase(@Body() dto: CreatePurchaseDto, @GetUser() user: User): Promise<void> {
        return this.purchaseService.purchase(user.id, dto.eventId, dto.quantity)
    }

    @Get('find')
    async getUserPurchases(@GetUser() user: User): Promise<PurchaseDto[]> {
        return this.purchaseService.getUserPurchases({ userId: user.id })
    }


}
