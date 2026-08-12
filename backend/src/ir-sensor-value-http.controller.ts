import { Body, Controller, Get, Post } from '@nestjs/common';
import { IrSensorValueCreateReqDto } from './ir-sensor-value-create-req.dto.js';
import { IrSensorValueService } from './ir-sensor-value.service.js';
import { IrSensorValue } from './generated/prisma/client.js';

@Controller()
export class IrSensorValueHttpController {
  constructor(private readonly irSensorValueService: IrSensorValueService) {}

  @Get('sensor-list')
  async list() {
    return await this.irSensorValueService.fetchSensorData();
  }

  @Post('sensor-list')
  async create(@Body() dto: IrSensorValueCreateReqDto): Promise<IrSensorValue> {
    console.log('here is create in IrSensorValueHttpController.');

    return await this.irSensorValueService.registerSensor(dto);
  }
}
