import { ForbiddenOperationException } from '../../errors/security.exception.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRequest } from '@omnixys/context';
import type { RealmRoleType } from '@omnixys/contracts';
import { OmnixysLogger } from '@omnixys/logger';

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
      throw new ForbiddenOperationException('User not authenticated', {
        reason: 'unauthenticated',
        requiredRoles,
      });
    }

    const roles = user.roles ?? [];

    const allowed = requiredRoles.some((role) => roles.includes(role));

    if (!allowed) {
      this.logger?.child(RoleGuard.name).warn('Role authorization denied', {
        reason: 'missing_role',
        requiredRoles,
      });
      throw new ForbiddenOperationException('Insufficient permissions', {
        reason: 'missing-role',
        requiredRoles,
      });
    }

    return true;
  }
}
