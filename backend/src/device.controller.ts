import { Controller, Get, Query } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { DeviceService } from './device.service.js';
import { DeviceRegisterReqDto, type DeviceRegisterPayload } from './dto/req/device.js';
import { Device } from './generated/prisma/client.js';

@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  // @Get('devices')
  // async getDevices(): Promise<Device[]> {
  //   // fillterで件数指定とか
  //   console.log('/devices controller!');

  //   // TODO: app.controller側を参考に
  //   return await this.deviceService.listDevices();
  // }

  @Get('devices')
  async indexDevices(): Promise<Device[]> {
    // TODO: @Query() filterを使って`?filter={collectMetrics:true}`を取得し、フィルターする
    // TODO: ただし、今はcollectMetricsをUI側で操作して変更する方法がないため、後回し

    return await this.deviceService.listDevices();
  }

  @(EventPattern('smart_remocon/devices/+/register') as MethodDecorator) // FIX: 修正待ち
  async handlerRegister(@Payload() data: DeviceRegisterPayload, @Ctx() context: MqttContext) {
    console.log(`topic: ${context.getTopic()}`);
    console.log(`register data.macAddress: ${data.macAddress}`);
    console.log(`register data.ipAddress: ${data.ipAddress}`);
    console.log(`register data.name: ${data.name}`);

    const dto = DeviceRegisterReqDto.fromPayload(data);
    await this.deviceService.registerDevice(dto); // FIX: dtoの中に必要なものは全部あるが、責務を明瞭にすべきか？
  }
}
