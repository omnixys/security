import { Injectable } from '@nestjs/common';

export interface VersionedPayload<T> {
  v: number;
  iat: number;
  data: T;
}

@Injectable()
export class TokenFactory {
  create<T>(data: T, version: number): VersionedPayload<T> {
    return {
      v: version,
      iat: Date.now(),
      data,
    };
  }
}
