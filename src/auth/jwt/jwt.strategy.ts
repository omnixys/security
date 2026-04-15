import { extractUserRoles } from '../utils/extract-roles.util.js';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('JWT_OPTIONS')
    private readonly options: {
      issuer: string;
      jwksUri: string;
      audience?: string;
    },
  ) {
    super({
      algorithms: ['RS256'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: options.issuer,
      audience: options.audience,

      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: options.jwksUri,
      }),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: extractUserRoles(payload),
      raw: payload,
    };
  }
}
