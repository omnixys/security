import { ROLES_KEY } from '../decorators/roles.decorator.js';
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRequest } from '@omnixys/context';
import type { RealmRoleType } from '@omnixys/shared';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<RealmRoleType[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const req = getRequest(context);

    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const roles = user.roles ?? [];

    const allowed = requiredRoles.some((role) => roles.includes(role));

    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
