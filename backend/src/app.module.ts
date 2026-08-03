import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { EnvLogRepo } from './env-log.repository.js';
import { EnvGateway } from './env.gateway.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DeviceController } from './device.controller.js';
import { DeviceRepo } from './device.repository.js';
import { DeviceService } from './device.service.js';
import { DeviceGateway } from './device.gateway.js';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppController, DeviceController],
  providers: [
    AppService,
    PrismaService,
    EnvLogRepo,
    EnvGateway,
    DeviceRepo,
    DeviceService,
    DeviceGateway,
  ],
})
export class AppModule {}
