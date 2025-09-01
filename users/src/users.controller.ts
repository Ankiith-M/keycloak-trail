import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  @Get('me')
  @Roles('CUSTOMER')
  me(@Req() req: any) {
    const u = req.user || {};
    return {
      sub: u.sub,
      username: u.preferred_username,
      email: u.email,
      roles: u?.realm_access?.roles ?? [],
    };
  }
  //Admin only endpoint
  @Get('admin/ping')
  @Roles('ADMIN')
  adminPing() {
    return { ok: true, at: new Date().toISOString() };
  }
}
