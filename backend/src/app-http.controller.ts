import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service.js';
import { EnvLogResDto } from './env-log/dto/env-log.js';
import { Ctx, EventPattern, MqttContext, Payload, RpcException } from '@nestjs/microservices';
import { EnvLogRecordReqDto } from './env-log/dto/env-log-record-req.dto.js';
import {
  DeviceNotFoundHttpException,
  DeviceNotFoundMqttException,
} from './app/exception/device-not-found.exception.js';
import { DeviceNotFoundError } from './app/error/device-not-found.error.js';
import { MacAddressRequiredMqttException } from './app/exception/mac-address-required.exception.js';

// Request DTO
@Controller()
export class AppHttpController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): string {
    return this.appService.getTest();
  }

  @Post('devices/:deviceMacAddress/env')
  async createEnvLogHttp(
    @Param('deviceMacAddress') macAddress: string,
    @Body() body: EnvLogRecordReqDto,
  ) {
    console.log(`macAddress: ${macAddress}`);
    console.log('body.temperatureSht: ', body.temperatureSht);

    try {
      const savedData = await this.appService.recordEnvLog(macAddress, body);
      return {
        data: savedData,
      };
    } catch (error) {
      if (error instanceof DeviceNotFoundError) {
        throw new DeviceNotFoundHttpException(macAddress);
      }

      throw error;
    }
  }

  @Get('env-logs')
  async getEnvLogs(@Query('limit') limit?: string) {
    console.log('/env-logs controller!');

    const limitNum = limit ? Number(limit) : undefined;
    const envLogs = await this.appService.fetchEnvLogs(limitNum); // TODO: 将来的には、srvから得た成果物を、HTTPレスポンスの形としてDTOをかます

    return EnvLogResDto.fromEntities(envLogs);
  }
}
