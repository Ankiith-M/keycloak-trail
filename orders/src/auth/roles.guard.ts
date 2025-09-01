import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(), ctx.getClass(),
    ]);
    if (!required?.length) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user || {};
    const realm = user?.realm_access?.roles ?? [];
    const clientId = process.env.KEYCLOAK_AUDIENCE!;
    const client = user?.resource_access?.[clientId]?.roles ?? [];
    const have = new Set([...realm, ...client]);
    return required.every(r => have.has(r));
  }
}
