import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { DeviceService } from './device.service.js';
import { DeviceRegisterReqDto, type DeviceRegisterPayload } from './dto/req/device.js';
import { Device, IrSensorValue } from './generated/prisma/client.js';
import { IrSensorValueService } from './ir-sensor-value.service.js';

@Controller()
export class IrSensorValueController {
  constructor(private readonly irSensorValueService: IrSensorValueService) {}

  @Get('sensor-list')
  async list() {
    return await this.irSensorValueService.list();
  }

  @Post('sensor-list')
  async create(
    @Body()
    body: {
      device: { id: number };
      name: string;
      data: string;
    },
  ) {
    return await this.irSensorValueService.create(body);
  }

  @Delete('sensor/:id')
  async delete(@Param('id') id: string) {
    return await this.irSensorValueService.remove(Number(id));
  }
}
