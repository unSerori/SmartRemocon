import { Module } from '@nestjs/common';
import { AppMqttController } from './app-mqtt.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { EnvLogRepo } from './env-log.repository.js';
import { EnvGateway } from './env.gateway.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DeviceMqttController } from './device-mqtt.controller.js';
import { DeviceRepo } from './device.repository.js';
import { DeviceService } from './device.service.js';
import { DeviceGateway } from './device.gateway.js';
import { IrSensorValueRepo } from './ir-sensor-value.repository.js';
import { IrSensorValueService } from './ir-sensor-value.service.js';
import { IrSensorValueController } from './ir-sensor-value.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT_SERVICE } from './app.constant.js';
import { DeviceHttpController } from './device-http.controller.js';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ClientsModule.register([
      {
        name: MQTT_SERVICE,
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL ?? 'mqtt://mosquitto:1883',
        },
      },
    ]),
  ],
  controllers: [
    AppMqttController,
    DeviceHttpController,
    DeviceMqttController,
    IrSensorValueController,
  ],
  providers: [
    AppService,
    PrismaService,
    EnvLogRepo,
    EnvGateway,
    DeviceRepo,
    DeviceService,
    DeviceGateway,
    IrSensorValueRepo,
    IrSensorValueService,
  ],
})
export class AppModule {}
