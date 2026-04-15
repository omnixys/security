import { extractUserRoles } from '../utils/extract-roles.util.js';
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { getRequest } from '@omnixys/context';
import type { AuthUser } from '@omnixys/shared';

export interface CurrentUserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];

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

    return {
      id: user.sub ?? userInfo.sub,
      username: user.preferred_username ?? userInfo.preferred_username,
      email: user.email,
      firstName: user.given_name ?? userInfo.given_name,
      lastName: user.family_name ?? userInfo.family_name,
      roles: extractUserRoles(user.raw),
      access_token: req.cookies.access_token,
      refresh_token: req.cookies.refresh_token,
      raw: user,
    };
  },
);
