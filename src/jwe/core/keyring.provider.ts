import { Injectable, Logger } from '@nestjs/common';

export interface JweKey {
  kid: string;
  material: Uint8Array;
}

@Injectable()
export class KeyringProvider {
  private readonly logger = new Logger(KeyringProvider.name);
  private readonly keys: JweKey[] = [];
  private readonly enabled: boolean;

  constructor(keys?: JweKey[]) {
    if (!keys || keys.length === 0) {
      this.enabled = false;
      this.logger.warn('KeyringProvider disabled: no keys configured');
      return;
    }

    this.keys = keys;
    this.enabled = true;
  }

  private assertEnabled(): void {
    if (!this.enabled || this.keys.length === 0) {
      throw new Error('KeyringProvider is not configured (no keys)');
    }
  }

  getActive(): JweKey {
    this.assertEnabled();
    return this.keys[0];
  }

  getAll(): JweKey[] {
    this.assertEnabled();
    return this.keys;
  }
}
