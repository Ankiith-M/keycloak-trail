import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AzpGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user || {};
    const allowed = (process.env.ALLOWED_SERVICE_AZP || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (!user?.azp) return false;
    if (!allowed.length) return false; // be strict by default
    return allowed.includes(user.azp);
  }
}
