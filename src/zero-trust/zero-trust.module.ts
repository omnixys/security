/**
 * @license GPL-3.0-or-later
 */

import { DEVICE_STORE, DEVICE_TRUST_TTL_SECONDS, GEOIP_PROVIDER } from '../security.constants.js';
import { ZeroTrustOptions } from '../types/security.types.js';
import { DEFAULT_GEOIP_OPTIONS, GeoIpService, type GeoIpServiceOptions } from './core/geoip.service.js';
import { ZeroTrustGuard } from './core/zero-trust.guard.js';
import { ZeroTrustService } from './core/zero-trust.service.js';
import { DeviceService } from './device/device.service.js';
import { ZeroTrustExceptionFilter } from './error/zero-trust.filter.js';
import { PolicyService } from './policy/policy.service.js';
import { RiskEngineService } from './risk/risk-engine.service.js';
import { RiskMemoryService } from './risk/risk-memory.service.js';
import { HttpModule } from '@nestjs/axios';
import { Module, DynamicModule, Global, type Provider } from '@nestjs/common';

@Global()
@Module({})
export class ZeroTrustModule {
  static forRoot(options: ZeroTrustOptions): DynamicModule {
    const storeProviders: Provider[] = [];
    const storeExports: Array<string | symbol> = [];

    if (options.device) {
      storeProviders.push(
        { provide: 'DEVICE_STORE', useValue: options.device },
        { provide: DEVICE_STORE, useExisting: 'DEVICE_STORE' },
      );
      storeExports.push('DEVICE_STORE', DEVICE_STORE);
    }

    if (options.riskMemoryStore) {
      storeProviders.push({
        provide: 'RISK_MEMORY_STORE',
        useValue: options.riskMemoryStore,
      });
      storeExports.push('RISK_MEMORY_STORE');
    }

    const geoipOptions: GeoIpServiceOptions = {
      ...DEFAULT_GEOIP_OPTIONS,
      ...options.geoip,
      provider: (options.geoip?.provider ??
        process.env.GEOIP_PROVIDER ??
        DEFAULT_GEOIP_OPTIONS.provider) as 'ip-api' | 'ipinfo',
      ipinfoToken: options.geoip?.ipinfoToken ?? process.env.IPINFO_TOKEN,
    };

    const deviceTrustTtl =
      options.deviceTrustTtlSeconds ?? Number(process.env.DEVICE_TRUST_TTL ?? 60 * 60 * 24 * 30);

    return {
      module: ZeroTrustModule,
      imports: [HttpModule, ...(options.imports ?? [])],
      providers: [
        ZeroTrustService,
        ZeroTrustGuard,
        ZeroTrustExceptionFilter,

        // Core Signals
        RiskEngineService,
        DeviceService,
        GeoIpService,
        PolicyService,
        RiskMemoryService,

        // Config providers
        { provide: GEOIP_PROVIDER, useValue: geoipOptions },
        { provide: DEVICE_TRUST_TTL_SECONDS, useValue: deviceTrustTtl },
        ...storeProviders,
      ],
      exports: [
        ZeroTrustService,
        ZeroTrustGuard,
        DeviceService,
        RiskEngineService,
        RiskMemoryService,
        ...storeExports,
      ],
    };
  }
}
