import { BaseError } from './base.error.js';

export class DeviceNotFoundError extends BaseError {
  constructor(public readonly macAddress: string) {
    super(`Device not found. MAC address: ${macAddress}`);
  }
}
