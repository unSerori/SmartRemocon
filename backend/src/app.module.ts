import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { EnvLogRepo } from './env-log.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, EnvLogRepo],
})
export class AppModule {}
