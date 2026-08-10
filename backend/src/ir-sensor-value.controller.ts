import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { DeviceService } from './device.service.js';
import { DeviceRegisterReqDto } from './device/dto/device.js';
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

  @Put('sensor/:id')
  async updateName(@Param('id') id: string, @Body() body: { name: string }) {
    console.log(`id: ${id}`);

    return await this.irSensorValueService.updateName(Number(id), body.name);
  }

  @Post('esp/learn')
  async learn(@Body() body: { sensorId: number }) {
    await this.irSensorValueService.learn(body.sensorId);
    return { ok: true };
  }

  @Post('esp/send')
  async excute(@Body() body: { sensorId: number; learnedIRData: string }) {
    await this.irSensorValueService.execute(body.sensorId, body.learnedIRData);
    return { ok: true };
  }

  @EventPattern('smart_remocon/devices/+/ir/learned')
  async handleLearned(@Payload() data: { sensorId: number; irData: string }) {
    console.log('learned payload: ', JSON.stringify(data));

    await this.irSensorValueService.updateLearnedData(data.sensorId, data.irData);
  }
}
