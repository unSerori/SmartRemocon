import { Controller, Inject } from '@nestjs/common';
import { IrSensorValue } from './generated/prisma/client.js';
import { IrSensorValueRepo } from './ir-sensor-value.repository.js';
import { IrSensorValueCreateReqDto } from './ir-sensor-value-create-req.dto.js';
import { ClientProxy } from '@nestjs/microservices';
import { MQTT_SERVICE } from './app.constant.js';

@Controller()
export class IrSensorValueService {
  constructor(
    private readonly irSensorValueRepo: IrSensorValueRepo,
    @Inject(MQTT_SERVICE) private readonly mqttClient: ClientProxy,
  ) {}

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

  async learnSensorData(sensorId: number) {
    const sensor = await this.irSensorValueRepo.getBySensorId(sensorId);
    const topic = `smart_remocon/devices/${sensor.device.macAddress}/ir/learn`;

    console.log(`topic: ${topic}`);

    this.mqttClient.emit(topic, { sensorId });
  }
}
