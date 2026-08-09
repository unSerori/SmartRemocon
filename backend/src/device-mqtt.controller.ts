import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { DeviceService } from './device.service.js';
import { DeviceRegisterReqDto } from './dto/req/device.js';

@Controller()
export class DeviceMqttController {
  constructor(private readonly deviceService: DeviceService) {}

  @(EventPattern('smart_remocon/devices/+/register') as MethodDecorator) // FIX: 修正待ち
  async handlerRegister(@Payload() dto: DeviceRegisterReqDto, @Ctx() context: MqttContext) {
    console.log(`topic: ${context.getTopic()}`);
    console.log(`register data.macAddress: ${dto.macAddress}`);
    console.log(`register data.ipAddress: ${dto.ipAddress}`);
    console.log(`register data.name: ${dto.name}`);

    await this.deviceService.registerDevice(dto);
  }
}
