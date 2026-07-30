import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { EnvLogRepo } from './env-log.repository.js';
import { EnvGateway } from './env.gateway.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, EnvLogRepo, EnvGateway],
})
export class AppModule {}
