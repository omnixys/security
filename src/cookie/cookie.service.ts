import { SECURITY_OPTIONS } from '../security.constants.js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CookieService {
  constructor(
    @Inject(SECURITY_OPTIONS)
    private readonly options: any,
  ) {}

  getDefaults() {
    return {
      httpOnly: true,
      secure: this.options.cookie?.secure ?? true,
      sameSite: this.options.cookie?.sameSite ?? 'none',
      domain: this.options.cookie?.domain,
      path: this.options.cookie?.path ?? '/',
    };
  }
}
