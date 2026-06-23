import type { EventRoleType } from '@omnixys/contracts';
import { SetMetadata } from '@nestjs/common';

export const EVENT_ROLES_KEY = Symbol('event_roles');

export function EventRoles(
  ...roles: EventRoleType[]
): MethodDecorator & ClassDecorator {
  return SetMetadata(EVENT_ROLES_KEY, roles);
}
