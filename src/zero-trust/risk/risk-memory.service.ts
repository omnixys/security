import { RiskMemoryStore } from './risk-memory.store.js';
import { Inject, Injectable, Optional } from '@nestjs/common';

export interface StepUpContext {
  ip?: string;
  deviceId?: string;
  userAgent?: string;
}

@Injectable()
export class RiskMemoryService {
  private readonly ttlSeconds = 900; // failures TTL (15 min)
  private readonly stepUpTtlSeconds = 600; // step-up trust window (10 min)

  constructor(
    @Optional()
    @Inject('RISK_MEMORY_STORE')
    readonly cache?: RiskMemoryStore,
  ) {}

  async incrementFailures(userId: string): Promise<number> {
    if (!this.cache) return 0;
    const key = `risk:user:${userId}:failures`;
    const count = await this.cache.incr(key);
    await this.cache.expire(key, this.ttlSeconds);
    return count;
  }

  async getFailures(userId: string): Promise<number> {
    if (!this.cache) return 0;
    const key = `risk:user:${userId}:failures`;
    const value = await this.cache.get(key);
    return value ? Number(value) : 0;
  }

  async resetFailures(userId: string): Promise<void> {
    if (!this.cache) return;
    await this.cache.del(`risk:user:${userId}:failures`);
  }

  async storeLastIp(userId: string, ip: string): Promise<void> {
    if (!this.cache) return;
    await this.cache.set(`risk:user:${userId}:last-ip`, ip, { EX: 86400 });
  }

  async getLastIp(userId: string): Promise<string | null> {
    return this.cache?.get(`risk:user:${userId}:last-ip`) ?? null;
  }

  /**
   * Marks that a user has successfully completed a step-up verification
   * (e.g., TOTP, WebAuthn).
   *
   * This creates a short-lived trust window bound to context (IP + device).
   */
  async markStepUpVerified(userId: string, context: StepUpContext): Promise<void> {
    if (!this.cache) return;
    const key = this.buildStepUpKey(userId, context);

    const payload = {
      verifiedAt: Date.now(),
      ip: context.ip,
      deviceId: context.deviceId,
      userAgent: context.userAgent,
    };

    await this.cache.set(key, JSON.stringify(payload), {
      EX: this.stepUpTtlSeconds,
    });
  }

  /**
   * Checks whether a valid step-up verification exists for the given context.
   */
  async isStepUpValid(userId: string, context: StepUpContext): Promise<boolean> {
    if (!this.cache) return false;
    const key = this.buildStepUpKey(userId, context);
    const raw = await this.cache.get(key);

    if (!raw) {
      return false;
    }

    try {
      const data = JSON.parse(raw) as {
        ip?: string;
        deviceId?: string;
      };

      // Optional: strict matching
      if (data.ip && context.ip && data.ip !== context.ip) {
        return false;
      }

      if (data.deviceId && context.deviceId && data.deviceId !== context.deviceId) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Optional: clear step-up state manually
   */
  async clearStepUp(userId: string, context: StepUpContext): Promise<void> {
    if (!this.cache) return;
    const key = this.buildStepUpKey(userId, context);
    await this.cache.del(key);
  }

  /**
   * Internal key builder
   *
   * IMPORTANT:
   * We bind trust to user + device + ip → Zero Trust compliant
   */
  private buildStepUpKey(userId: string, context: StepUpContext): string {
    const device = context.deviceId ?? 'unknown-device';
    const ip = context.ip ?? 'unknown-ip';

    return `risk:user:${userId}:stepup:${device}:${ip}`;
  }
}
