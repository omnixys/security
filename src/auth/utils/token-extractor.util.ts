import type { FastifyRequest } from 'fastify';

export function extractBearerToken(req: FastifyRequest): string | null {
  const header = req.headers.authorization;

  if (!header) {
    return null;
  }

  const parts = header.split(' ');

  if (parts.length !== 2) {
    return null;
  }

  const [type, token] = parts;

  if (type !== 'Bearer' || !token) {
    return null;
  }

  return token.trim();
}

export function extractAccessTokenCookie(req: FastifyRequest): string | null {
  return req.cookies?.access_token ?? null;
}

export function extractRefreshTokenCookie(req: FastifyRequest): string | null {
  return req.cookies?.refresh_token ?? null;
}

export function extractToken(req: FastifyRequest): string | null {
  return extractBearerToken(req) ?? extractAccessTokenCookie(req);
}
