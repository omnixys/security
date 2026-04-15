/**
 * @license GPL-3.0-or-later
 */

import { HmacService } from '../hash/hmac.service.js';
import { ZeroTrustOptions } from '../types/security.types.js';
import { GeoIpService } from './core/geoip.service.js';
import { ZeroTrustGuard } from './core/zero-trust.guard.js';
import { ZeroTrustService } from './core/zero-trust.service.js';
import { DeviceService } from './device/device.service.js';
import { DeviceStore } from './device/device.store.js';
import { ZeroTrustExceptionFilter } from './error/zero-trust.filter.js';
import { PolicyService } from './policy/policy.service.js';
import { RiskEngineService } from './risk/risk-engine.service.js';
import { RiskMemoryService } from './risk/risk-memory.service.js';
import { HttpModule } from '@nestjs/axios';
import { Module, DynamicModule, Global } from '@nestjs/common';

@Global()
@Module({})
export class ZeroTrustModule {
  static forRoot(options: ZeroTrustOptions): DynamicModule {
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
      ],
      exports: [
        ZeroTrustService,
        ZeroTrustGuard,
        DeviceService,
        RiskEngineService,
        RiskMemoryService,
      ],
    };
  }
}
