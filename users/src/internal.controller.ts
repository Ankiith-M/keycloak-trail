import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AzpGuard } from './auth/azp.guard';

@Controller('users/internal')
@UseGuards(AuthGuard('jwt'), AzpGuard)
export class InternalController {
  @Get('ping')
  ping(@Req() req: any) {
    return { ok: true, azp: req.user?.azp, at: new Date().toISOString() };
  }
}
