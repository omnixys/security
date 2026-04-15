import { SECURITY_OPTIONS } from '../security.constants.js';
import { RateLimitStore } from './rate-limit.store.js';
import { Inject, Injectable } from '@nestjs/common';
import { CacheObservabilityService } from '@omnixys/observability';

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  remaining?: number;
  resetAt?: number; // epoch ms
}

@Injectable()
export class RateLimitService {
  constructor(
    @Inject(SECURITY_OPTIONS) private readonly options: any,
    @Inject('RATE_LIMIT_STORE')
    readonly cache: RateLimitStore,
    private readonly observability: CacheObservabilityService,
  ) {}

  async isAllowed(key: string): Promise<RateLimitResult> {
    return this.observability.trace('rate_limit.hit', key, async (span) => {
      if (!this.options.rateLimit?.enabled) return { allowed: true };

      const limit = this.options.rateLimit.defaultLimit ?? 100;
      const windowMs = this.options.rateLimit.defaultWindowMs ?? 60000;
      const windowSeconds = Math.ceil(windowMs / 1000);

      const current = await this.cache.incr(key);

      if (current === 1) {
        await this.cache.expire(key, windowSeconds);
      }

      const ttl = await this.cache.ttl(key);
      const remaining = Math.max(limit - current, 0);
      const allowed = current <= limit;

      span?.setAttribute('rate_limit.key', key);
      span?.setAttribute('rate_limit.limit', limit);
      span?.setAttribute('rate_limit.ttl_seconds', windowSeconds);
      span?.setAttribute('rate_limit.current', current);
      span?.setAttribute('rate_limit.allowed', current <= limit);
      span?.setAttribute('rate_limit.remaining', remaining);
      if (!allowed) {
        span?.setAttribute('rate_limit.retry_after', ttl);
      }

      if (!allowed) {
        console.warn('RATE LIMIT');
        return {
          allowed,
          retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
          remaining: 0,
          resetAt: Date.now() + (ttl > 0 ? ttl * 1000 : windowMs),
        };
      }

      return {
        allowed: true,
        remaining,
        resetAt: Date.now() + (ttl > 0 ? ttl * 1000 : windowMs),
      };
    });
  }
}
