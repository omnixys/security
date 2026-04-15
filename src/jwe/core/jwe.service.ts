import { KeyringProvider } from './keyring.provider.js';
import { Injectable } from '@nestjs/common';
import * as jose from 'jose';

@Injectable()
export class JweService {
  constructor(private readonly keyring: KeyringProvider) {}

  async encrypt(payload: unknown): Promise<string> {
    const active = this.keyring.getActive();

    return new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(payload)))
      .setProtectedHeader({
        alg: 'dir',
        enc: 'A256GCM',
        kid: active.kid,
      })
      .encrypt(active.material);
  }

  async decrypt<T>(token: string): Promise<T> {
    const keys = this.keyring.getAll();

    for (const key of keys) {
      try {
        const { plaintext } = await jose.compactDecrypt(token, key.material);
        return JSON.parse(new TextDecoder().decode(plaintext)) as T;
      } catch {
        // try next key
      }
    }

    throw new Error('Unable to decrypt token with any key');
  }
}
