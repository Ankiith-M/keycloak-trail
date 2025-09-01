import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AzpGuard } from './auth/azp.guard';
import { OrdersService } from './orders.service';

@Controller('orders/internal')
@UseGuards(AuthGuard('jwt'), AzpGuard)
export class InternalController {
  constructor(private readonly orders: OrdersService) {}

  // PATCH /orders/internal/:id/mark-paid
  @Patch(':id/mark-paid')
  async markPaid(@Param('id') id: string) {
    const row = await this.orders.markPaid(id);
    return row.toJSON(); // { id, status: 'PAID', totalAmount, currency, createdAt, ... }
  }
}
