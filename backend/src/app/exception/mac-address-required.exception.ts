import { RpcException } from '@nestjs/microservices';

export class MacAddressRequiredMqttException extends RpcException {
  constructor() {
    super({
      code: 'MAC_ADDRESS_REQUIRED' as const,
      msg: 'MAC address could not be extracted from the MQTT topic.',
    });
  }
}
