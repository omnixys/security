import { JWE_STORE } from '../../security.constants.js';
import { JweService } from '../core/jwe.service.js';
import type { JweStore } from './store.interface.js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class JweStoreService {
  constructor(
    private readonly jwe: JweService,
    @Inject(JWE_STORE) private readonly store: JweStore,
  ) {}

  async put<T>(keyString: string, payload: T, ttl?: number): Promise<string> {
    const id = crypto.randomUUID();
    const key = `${keyString}:${id}`;

    const token = await this.jwe.encrypt(payload);
    await this.store.set(key, token, ttl);
    return id;
  }

  async get<T>(key: string): Promise<T | null> {
    const token = await this.store.get(key);
    if (!token) return null;

    return this.jwe.decrypt<T>(token);
  }

  async delete(key: string): Promise<void> {
    await this.store.del(key);
  }
}
