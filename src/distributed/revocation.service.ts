import type { RevocationStore } from '../types/security.types.js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TokenRevocationService {
  constructor(
    @Inject('REVOCATION_STORE')
    private readonly store: RevocationStore,
  ) {}

  async revoke(jti: string, ttlSec: number): Promise<void> {
    await this.store.set(`revoked:${jti}`, '1', ttlSec);
  }

  async isRevoked(jti: string): Promise<boolean> {
    return this.store.exists(`revoked:${jti}`);
  }
}
