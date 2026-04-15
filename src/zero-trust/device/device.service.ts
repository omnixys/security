/**
 * @license GPL-3.0-or-later
 */

import { HmacService } from '../../hash/hmac.service.js';
import { DeviceStore } from './device.store.js';
import { Inject, Injectable, Optional } from '@nestjs/common';
import * as fastify from 'fastify';

@Injectable()
export class DeviceService {
  private readonly ttlSeconds: number;

  constructor(
    private readonly hmac: HmacService,
    @Optional()
    @Inject('DEVICE_STORE')
    private readonly store?: DeviceStore,
  ) {
    this.ttlSeconds = Number(process.env.DEVICE_TRUST_TTL ?? 60 * 60 * 24 * 30);
  }

  /**
   * Privacy-safe fingerprint hashing via HMAC.
   */
  private normalize(fingerprint: string): string {
    return this.hmac.hash(fingerprint, 'deviceFingerprint');
  }

  /**
   * Checks whether a device is already trusted.
   */
  async isKnown(userId: string, fingerprint: string): Promise<boolean> {
    if (!this.store) {
      return false;
    }

    const hashed = this.normalize(fingerprint);
    const key = `device:${userId}:${hashed}`;

    const exists = await this.store.get(key);
    return !!exists;
  }

  /**
   * Registers a trusted device.
   * IMPORTANT: Only call AFTER successful MFA / step-up.
   */
  async register(userId: string, fingerprint: string): Promise<void> {
    if (!this.store) {
      return;
    }

    const hashed = this.normalize(fingerprint);
    const key = `device:${userId}:${hashed}`;

    await this.store.set(key, '1', { EX: this.ttlSeconds });
  }

  /**
   * Revokes a trusted device manually.
   */
  async revoke(userId: string, fingerprint: string): Promise<void> {
    if (!this.store?.del) {
      return;
    }

    const hashed = this.normalize(fingerprint);
    const key = `device:${userId}:${hashed}`;

    await this.store.del(key);
  }
}
