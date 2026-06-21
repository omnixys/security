import type { SecurityJwtOptions } from '../types/security.types.js';
import { SecurityPrincipalResolver } from './context/security-principal.resolver.js';
import { CookieAuthGuard } from './guards/cookie-auth.guard.js';
import { HeaderAuthGuard } from './guards/header-auth.guard.js';
import { RoleGuard } from './guards/role.guard.js';
import { JwtStrategy } from './jwt/jwt.strategy.js';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({})
export class AuthModule {
  static forRoot(options: SecurityJwtOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.register({}),
      ],
      providers: [
        {
          provide: 'JWT_OPTIONS',
          useValue: options,
        },
        JwtStrategy,
        SecurityPrincipalResolver,
        HeaderAuthGuard,
        CookieAuthGuard,
        RoleGuard,
      ],
      exports: [
        PassportModule,
        HeaderAuthGuard,
        CookieAuthGuard,
        RoleGuard,
        JwtStrategy,
        SecurityPrincipalResolver,
      ],
    };
  }
}
