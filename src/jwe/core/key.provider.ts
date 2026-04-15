import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyProvider {
  constructor(private readonly raw: string) {}

  getKey(): Uint8Array {
    if (!this.raw) {
      throw new Error('JWE key missing');
    }

    // base64 first
    const buf = Buffer.from(this.raw, 'base64');

    if (buf.length === 32) {
      return buf;
    }

    // fallback UTF-8 BUT STRICT
    const utf8 = new TextEncoder().encode(this.raw);

    if (utf8.length !== 32) {
      throw new Error(
        `Invalid JWE key length: ${utf8.length} bytes (required: 32 bytes)`,
      );
    }

    return utf8;
  }
}
