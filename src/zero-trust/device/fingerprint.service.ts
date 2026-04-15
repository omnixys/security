import { createFingerprint } from './fingerprint.util.js';
import { Inject, Injectable, Optional } from '@nestjs/common';

@Injectable()
export class FingerprintService {
  constructor(
    @Optional()
    @Inject('FINGERPRINT_SECRET')
    private readonly secret: string,
  ) {}

  create(input: {
    userAgent: string;
    ip: string;
    acceptLanguage?: string;
    clientDeviceId?: string;
  }): string {
    return createFingerprint(input, this.secret);
  }
}
