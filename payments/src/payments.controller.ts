import { Controller, Param, Patch } from '@nestjs/common';
import { getMachineToken } from './auth/machine-token';
import axios from 'axios';

@Controller('payments')
export class PaymentsController {
  // PATCH /payments/debug/pay/:id  -> marks an order as PAID via Orders internal API
  @Patch('debug/pay/:id')
  async pay(@Param('id') id: string) {
    const token = await getMachineToken();
    const url = `${process.env.ORDERS_BASE_URL}/orders/internal/${id}/mark-paid`;
    const { data } = await axios.patch(url, null, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });
    return data; // returns the updated order
  }
}
