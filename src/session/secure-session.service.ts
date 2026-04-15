import { JweService } from '../jwe/core/jwe.service.js';
import { SECURITY_OPTIONS } from '../security.constants.js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SecureSessionService {
  constructor(
    private readonly jwe: JweService,
    @Inject(SECURITY_OPTIONS) private readonly options: any,
  ) {}

  async issue<T extends Record<string, unknown>>(payload: T): Promise<string> {
    const ttl = this.options.session?.ttlMs ?? 1000 * 60 * 60;

    return this.jwe.encrypt({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + ttl,
    });
  }

  async read<T>(token: string): Promise<T> {
    const data = await this.jwe.decrypt<any>(token);

    if (data.exp && Date.now() > data.exp) {
      throw new Error('Session expired');
    }

    return data;
  }
}
