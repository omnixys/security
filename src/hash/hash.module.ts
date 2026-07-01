/**
 * @license GPL-3.0-or-later
 */

import { HmacService } from './hmac.service.js';
import { HashOptions, ZeroTrustOptions } from '../types/security.types.js';
import { EncryptionService } from './encryption.service.js';
import { HashService } from './hash.service.js';
import { HttpModule } from '@nestjs/axios';
import { Module, DynamicModule, Global } from '@nestjs/common';

@Global()
@Module({})
export class HashModule {
  static forRoot(hash: HashOptions): DynamicModule {
    return {
      module: HashModule,
      imports: [HttpModule],
      providers: [
        HashService,
        EncryptionService,
        HmacService,

        {
          provide: 'HASH_OPTIONS',
          useValue: hash,
        },
      ],
      exports: [HmacService, HashService, EncryptionService],
    };
  }
}
