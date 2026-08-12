import { Controller } from '@nestjs/common';
import { IrSensorValue } from './generated/prisma/client.js';
import { IrSensorValueRepo } from './ir-sensor-value.repository.js';
import { IrSensorValueCreateReqDto } from './ir-sensor-value-create-req.dto.js';

@Controller()
export class IrSensorValueService {
  constructor(private readonly irSensorValueRepo: IrSensorValueRepo) {}

  async fetchSensorData() {
    return await this.irSensorValueRepo.list();
  }

  async registerSensor(sensor: IrSensorValueCreateReqDto): Promise<IrSensorValue> {
    return await this.irSensorValueRepo.add({
      deviceId: sensor.device.id,
      name: sensor.name,
      data: sensor.data,
    });
  }
}
