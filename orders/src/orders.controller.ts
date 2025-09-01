import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { OrdersService } from './orders.service';

class CreateOrderDto {
  totalAmount!: number;
  currency!: string; // e.g., "INR"
}

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get('me')
  @Roles('CUSTOMER')
  whoAmI(@Req() req: any) {
    const u = req.user || {};
    return { sub: u.sub, roles: u?.realm_access?.roles ?? [] };
  }

  @Post()
  @Roles('CUSTOMER')
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    const u = req.user || {};
    const row = await this.orders.createForUser(
      u.sub,
      Number(dto.totalAmount),
      dto.currency,
    );
    // Return all fields; totalAmount is a number via model getter
    return row.toJSON();
  }

  @Get()
  @Roles('CUSTOMER')
  async listMine(@Req() req: any) {
    const u = req.user || {};
    const list = await this.orders.listMine(u.sub);
    return list.map((o) => o.toJSON());
  }
}
