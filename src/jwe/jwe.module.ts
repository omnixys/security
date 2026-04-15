import { JWE_STORE } from '../security.constants.js';
import { JweService } from './core/jwe.service.js';
import { KeyringProvider, JweKey } from './core/keyring.provider.js';
import { TokenFactory } from './core/token.factory.js';
import { JweStoreService } from './store/jwe-store.service.js';
import { JweStore } from './store/store.interface.js';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

export interface JweModuleOptions {
  keys: Array<{
    kid: string;
    value: string; // base64
  }>;
  defaultTtlSec?: number;
  store?: JweStore;
}

@Global()
@Module({})
export class JweModule {
  static forRoot(options: JweModuleOptions): DynamicModule {
    const keyringProvider: Provider = {
      provide: KeyringProvider,
      useFactory: () => {
        const keys: JweKey[] = options.keys.map((k) => {
          const buf = Buffer.from(k.value, 'base64');

          if (buf.length !== 32) {
            throw new Error(`Invalid key length for kid=${k.kid}. Must be 32 bytes.`);
          }

          return {
            kid: k.kid,
            material: buf,
          };
        });

        return new KeyringProvider(keys);
      },
    };

    const storeProvider: Provider | undefined = options.store
      ? {
          provide: JWE_STORE,
          useValue: options.store,
        }
      : undefined;

    const providers: Provider[] = [keyringProvider, JweService, TokenFactory];
    const exportsArr: Provider[] = [JweService, TokenFactory];

    if (storeProvider) {
      providers.push(storeProvider);
      providers.push(JweStoreService);
      exportsArr.push(JweStoreService);
    }

    return {
      module: JweModule,
      providers,
      exports: exportsArr,
    };
  }
}
