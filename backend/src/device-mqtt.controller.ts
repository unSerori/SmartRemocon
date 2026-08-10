import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { DeviceService } from './device.service.js';
import { DeviceRegistationReqDto } from './device/dto/deviceRegistation.req.js';

@Controller()
export class DeviceMqttController {
  constructor(private readonly deviceService: DeviceService) {}

  @(EventPattern('smart_remocon/devices/+/register') as MethodDecorator) // FIX: 修正待ち
  async handlerRegister(@Payload() dto: DeviceRegistationReqDto, @Ctx() context: MqttContext) {
    console.log(`topic: ${context.getTopic()}`);
    console.log(`register data.macAddress: ${dto.macAddress}`);
    console.log(`register data.ipAddress: ${dto.ipAddress}`);
    console.log(`register data.name: ${dto.name}`);

    await this.deviceService.registerDevice(dto);
  }
}
