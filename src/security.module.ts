import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module.js';
import { JweModule } from './jwe/jwe.module.js';

import { SECURITY_OPTIONS } from './security.constants.js';
import type { SecurityModuleOptions } from './types/security.types.js';

import { CookieService } from './cookie/cookie.service.js';
import { RateLimitService } from './rate-limit/rate-limit.service.js';
import { SecureSessionService } from './session/secure-session.service.js';

import { HeaderAuthGuard } from './auth/guards/header-auth.guard.js';
import { RoleGuard } from './auth/guards/role.guard.js';
import { HashModule } from './hash/hash.module.js';
import { RateLimitGuard } from './rate-limit/rate-limit.guard.js';
import { ZeroTrustGuard } from './zero-trust/core/zero-trust.guard.js';
import { FingerprintService } from './zero-trust/index.js';
import { ZeroTrustModule } from './zero-trust/zero-trust.module.js';
import { ObservabilityModule } from '@omnixys/observability';
import { Hash } from 'node:crypto';

@Global()
@Module({})
export class SecurityModule {
  static forRoot(options: SecurityModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: SECURITY_OPTIONS,
      useValue: options,
    };
    const providers: Provider[] = [
      optionsProvider,
      SecureSessionService,
      RateLimitService,
      CookieService,
      FingerprintService,
      {
        provide: 'FINGERPRINT_SECRET',
        useValue: options.fingerprintSecret || 'default-secret',
      },
    ];

    const distributedProviders: Provider[] = [];

    if (options.distributed?.revocationStore) {
      distributedProviders.push({
        provide: 'REVOCATION_STORE',
        useValue: options.distributed.revocationStore,
      });
    }

    if (options.distributed?.auditProducer) {
      distributedProviders.push({
        provide: 'AUDIT_PRODUCER',
        useValue: options.distributed.auditProducer,
      });
    }

    const globalGuards: Provider[] = options.globalGuards
      ? [
          { provide: APP_GUARD, useClass: HeaderAuthGuard },
          { provide: APP_GUARD, useClass: RoleGuard },
          { provide: APP_GUARD, useClass: ZeroTrustGuard },
        ]
      : [];

    const gloabalRateLimitGuard: Provider[] = options.rateLimit?.enabled
      ? [{ provide: APP_GUARD, useClass: RateLimitGuard }]
      : [];

    return {
      module: SecurityModule,
      imports: [
        ObservabilityModule,
        AuthModule.forRoot(options.jwt),
        JweModule.forRoot(options.jwe || { keys: [] }),
        ZeroTrustModule.forRoot(
          options?.zeroTrust || { device: null as any, riskMemoryStore: null as any },
        ),
        HashModule.forRoot(options?.hash || {}),
        ...(options?.rateLimit?.imports ?? []),
      ],
      providers: [...providers, ...distributedProviders, ...globalGuards, ...gloabalRateLimitGuard],
      exports: [
        AuthModule,
        ZeroTrustModule,
        SecureSessionService,
        RateLimitService,
        CookieService,
        FingerprintService,
      ],
    };
  }
}
