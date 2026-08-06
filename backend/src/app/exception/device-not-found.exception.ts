import { NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

function payload(macAddress: string) {
  return {
    code: 'DEVICE_NOT_FOUND' as const,
    msg: `Device not found, MAC address: ${macAddress}`,
  };
}

export class DeviceNotFoundHttpException extends NotFoundException {
  constructor(public readonly macAddress: string) {
    super(payload(macAddress));
  }
}

export class DeviceNotFoundMqttException extends RpcException {
  constructor(public readonly macAddress: string) {
    super(payload(macAddress));
  }
}
