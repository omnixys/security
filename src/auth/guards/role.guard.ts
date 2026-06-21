import { ROLES_KEY } from '../decorators/roles.decorator.js';
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRequest } from '@omnixys/context';
import { OmnixysLogger } from '@omnixys/logger';
import type { RealmRoleType } from '@omnixys/contracts';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Optional() private readonly logger?: OmnixysLogger,
  ) {}

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
      this.logger?.child(RoleGuard.name).warn('Role authorization denied', {
        reason: 'unauthenticated',
        requiredRoles,
      });
      throw new ForbiddenException('User not authenticated');
    }

    const roles = user.roles ?? [];

    const allowed = requiredRoles.some((role) => roles.includes(role));

    if (!allowed) {
      this.logger?.child(RoleGuard.name).warn('Role authorization denied', {
        reason: 'missing_role',
        requiredRoles,
      });
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
