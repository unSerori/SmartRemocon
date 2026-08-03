import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';

interface DeviceRegisterPayload {
  macAddress: string;
  ipAddress: string;
  name: string;
}

@Controller()
export class DeviceController {
  // constructor(private readonly deviceRepo: DeviceRepo) {}

  @(EventPattern('smart_remocon/devices/+/register') as MethodDecorator) // FIX: 修正待ち
  async handlerRegister(@Payload() data: DeviceRegisterPayload, @Ctx() context: MqttContext) {
    console.log(`topic: ${context.getTopic()}`);
    console.log(`register data.macAddress: ${data.macAddress}`);
    console.log(`register data.ipAddress: ${data.ipAddress}`);
    console.log(`register data.name: ${data.name}`);

    // TODO: ここでDBに登録
    // TODO: 成功したらwsのイベントを発火させてfrontendに反映
  }
}
