import { EventRoleType } from '@omnixys/contracts';
import { EVENT_ROLES_KEY } from '../decorators/event-roles.decorator.js';
import { EventRoleResolver } from './event-role-resolver.js';
import { EventAccessDeniedException } from '../../errors/event-access-denied.exception.js';
import { extractEventId } from '../utils/extract-event-id.util.js';
import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRequest } from '@omnixys/context';

@Injectable()
export class EventRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly resolver: EventRoleResolver,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<EventRoleType[]>(
      EVENT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = getRequest(context);
    const user = req.user;

    if (!user) {
      throw new EventAccessDeniedException('unknown', 'unauthenticated');
    }

    const eventId = extractEventId(req);

    if (!eventId) {
      throw new EventAccessDeniedException('unknown', 'event-id-required');
    }

    const role = await this.resolver.getRoleForUser(user.id, eventId);

    if (!role || !requiredRoles.includes(role)) {
      throw new EventAccessDeniedException(eventId, 'required-event-role-missing');
    }

    return true;
  }
}
