import { Injectable } from '@nestjs/common';
import { DeviceRepo } from './device.repository.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Device, IrSensorValue } from './generated/prisma/client.js';
import { DeviceRegisterReqDto } from './dto/req/device.js';
import { DEVICE_REGISTER } from './device.events.js';
import { IrSensorValueRepo } from './ir-sensor-value.repository.js';

@Injectable()
export class IrSensorValueService {
  constructor(private readonly irSensorValueRepo: IrSensorValueRepo) {}

  async create(body: {
    device: {
      id: number;
    };
    name: string;
    data: string;
  }): Promise<IrSensorValue> {
    return await this.irSensorValueRepo.add({
      name: body.name,
      data: body.data,
      device: { connect: { id: body.device.id } },
    });
  }

  async list() {
    return await this.irSensorValueRepo.list();
  }

  async remove(id: number): Promise<IrSensorValue> {
    return await this.irSensorValueRepo.remove(id);
  }

  async updateName(id: number, name: string): Promise<IrSensorValue> {
    return await this.irSensorValueRepo.updateName(id, name);
  }
}
