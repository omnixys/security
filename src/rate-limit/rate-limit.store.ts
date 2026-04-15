import { RiskMemoryStore } from '../zero-trust/index.js';

export interface RateLimitStore {
  ttl(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
}
