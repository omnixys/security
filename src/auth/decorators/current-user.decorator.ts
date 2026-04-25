import { extractUserRoles } from '../utils/extract-roles.util.js';
import { resolvePrimaryRole } from '../utils/role-filter.util.js';
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { getRequest } from '@omnixys/context';
import type { AuthUser, RealmRoleType } from '@omnixys/shared';

export interface CurrentUserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: RealmRoleType | undefined;

  access_token?: string;
  refresh_token?: string;

  raw: AuthUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserData | null => {
    const req = getRequest(context);

    if (!req || !req?.user) {
      return null;
    }

    const user = req.user;
    const userInfo = user.raw;

    const roles = extractUserRoles(user.raw);
      const role = resolvePrimaryRole(roles);

    return {
      id: user.sub ?? userInfo.sub,
      username: user.preferred_username ?? userInfo.preferred_username,
      email: user.email,
      firstName: user.given_name ?? userInfo.given_name,
      lastName: user.family_name ?? userInfo.family_name,
      role,
      access_token: req.cookies.access_token,
      refresh_token: req.cookies.refresh_token,
      raw: user,
    };
  },
);
