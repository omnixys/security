import { RiskMemoryStore } from './risk-memory.store.js';
import { Inject, Injectable, Optional, Type } from '@nestjs/common';

@Injectable()
export class RiskMemoryService {
  private readonly ttlSeconds = 900;

  constructor(
    @Optional()
    @Inject('RISK_MEMORY_STORE')
    readonly cache: RiskMemoryStore,
  ) {}

  async incrementFailures(userId: string): Promise<number> {
    const key = `risk:user:${userId}:failures`;
    const count = await this.cache.incr(key);
    await this.cache.expire(key, this.ttlSeconds);
    return count;
  }

  async getFailures(userId: string): Promise<number> {
    const key = `risk:user:${userId}:failures`;
    const value = await this.cache.get(key);
    return value ? Number(value) : 0;
  }

  async resetFailures(userId: string): Promise<void> {
    await this.cache.del(`risk:user:${userId}:failures`);
  }

  async storeLastIp(userId: string, ip: string): Promise<void> {
    await this.cache.set(`risk:user:${userId}:last-ip`, ip, { EX: 86400 });
  }

  async getLastIp(userId: string): Promise<string | null> {
    return this.cache.get(`risk:user:${userId}:last-ip`);
  }
}
