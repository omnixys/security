/**
 * @license GPL-3.0-or-later
 */

export interface DeviceStore {
  set(
    key: string,
    value: string,
    options?: {
      EX?: number; // seconds TTL
    },
  ): Promise<void>;

  get(key: string): Promise<string | null>;

  del(key: string): Promise<void>;
}
