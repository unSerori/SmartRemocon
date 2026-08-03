import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { EnvLogRepo } from './env-log.repository.js';
import { EnvGateway } from './env.gateway.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DeviceController } from './device.controller.js';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppController, DeviceController],
  providers: [AppService, PrismaService, EnvLogRepo, EnvGateway],
})
export class AppModule {}
