/**
 * @license GPL-3.0-or-later
 */

import { DeviceStore } from '../device/device.store.js';

export interface RiskMemoryStore extends DeviceStore {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
}
