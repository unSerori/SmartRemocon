import { Inject, Injectable } from '@nestjs/common';
import { DeviceRepo } from './device.repository.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Device, IrSensorValue } from './generated/prisma/client.js';
import { DeviceRegistationReqDto } from './device/dto/device-registation.req.js';
import { DEVICE_REGISTER } from './device.events.js';
import { IrSensorValueRepo } from './ir-sensor-value.repository.js';
import { ClientProxy } from '@nestjs/microservices';
import { IR_SENSOR_LEARNED } from './ir-sensor-value.events.js';
import { MQTT_SERVICE } from './app.constant.js';

@Injectable()
export class IrSensorValueService {
  constructor(
    private readonly irSensorValueRepo: IrSensorValueRepo,
    private readonly eventEmmitter: EventEmitter2,
    @Inject(MQTT_SERVICE) private readonly mqttClinet: ClientProxy,
  ) {}

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

  // 学習開始のトリガー
  async learn(sensorId: number): Promise<void> {
    const sensor = await this.irSensorValueRepo.findByDeviceId(sensorId);

    const topic = `smart_remocon/devices/${sensor.device.macAddress}/ir/learn`;
    this.mqttClinet.emit(topic, { sensorId });
  }

  // 実行トリガー
  async execute(sensorId: number, learnedIRData: string): Promise<void> {
    const sensor = await this.irSensorValueRepo.findByDeviceId(sensorId);

    const topic = `smart_remocon/devices/${sensor.device.macAddress}/ir/execute`;
    this.mqttClinet.emit(topic, { data: learnedIRData });
  }

  // 学習結果を受けてDB更新 + ws発火
  async updateLearnedData(sensorId: number, data: string): Promise<IrSensorValue> {
    const updated = await this.irSensorValueRepo.updateData(sensorId, data);
    this.eventEmmitter.emit(IR_SENSOR_LEARNED, updated);

    return updated;
  }
}
