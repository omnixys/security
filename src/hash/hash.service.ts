import { HashOptions } from '../types/security.types.js';
import { Injectable, Inject, Optional } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  private readonly memoryCost: number;
  private readonly timeCost: number;
  private readonly parallelism: number;
  private readonly pepper: string;

  constructor(
    @Optional()
    @Inject('HASH_OPTIONS')
    readonly hashOptions: HashOptions,
  ) {
    this.memoryCost = hashOptions.memoryCost ?? 65536;
    this.timeCost = hashOptions.timeCost ?? 3;
    this.parallelism = hashOptions.parallelism ?? 1;
    this.pepper = hashOptions.pepper ?? '';
  }

  async hash(value: string): Promise<string> {
    return argon2.hash(value + this.pepper, {
      type: argon2.argon2id,
      memoryCost: this.memoryCost,
      timeCost: this.timeCost,
      parallelism: this.parallelism,
    });
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain + this.pepper);
    } catch {
      return false;
    }
  }

  async dummyVerify(): Promise<void> {
    const dummyHash =
      '$argon2id$v=19$m=65536,t=3,p=1$c29tZXNhbHQ$9sZfE6xY7nM7gqX8zSxjXxjYxjYxjYxjYxjYxjYxjY';
    try {
      await argon2.verify(dummyHash, 'dummy');
    } catch {
      // intentionally ignored
    }
  }
}
