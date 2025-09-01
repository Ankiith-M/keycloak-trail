import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order) private readonly orderModel: typeof Order) {}

  async createForUser(userSub: string, totalAmount: number, currency: string) {
    const row = await this.orderModel.create({ userSub, totalAmount, currency });
    await row.reload({
      attributes: ['id', 'status', 'totalAmount', 'currency', 'createdAt', 'userSub', 'updatedAt'],
    });
    return row;
  }

  listMine(userSub: string) {
    return this.orderModel.findAll({
      where: { userSub },
      attributes: ['id', 'status', 'totalAmount', 'currency', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
  }

  async markPaid(id: string) {
    const row = await this.orderModel.findByPk(id);
    if (!row) throw new NotFoundException('Order not found');
    await row.update({ status: 'PAID' });
    await row.reload({
      attributes: ['id', 'status', 'totalAmount', 'currency', 'createdAt', 'userSub', 'updatedAt'],
    });
    return row;
  }
}
