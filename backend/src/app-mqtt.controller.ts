import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service.js';
import { EnvLogResDto } from './dto/res/env-log.js';
import { Ctx, EventPattern, MqttContext, Payload, RpcException } from '@nestjs/microservices';
import { EnvLogReqDto } from './dto/req/env-log.js';
import {
  DeviceNotFoundHttpException,
  DeviceNotFoundMqttException,
} from './app/exception/device-not-found.exception.js';
import { DeviceNotFoundError } from './app/error/device-not-found.error.js';
import { MacAddressRequiredMqttException } from './app/exception/mac-address-required.exception.js';

// Request DTO
@Controller()
export class AppMqttController {
  constructor(private readonly appService: AppService) {}

  // こっちに移行（ただしhttpの方もテスト用に残す）
  @(EventPattern('smart_remocon/devices/+/env') as MethodDecorator) // FIX: 修正待ち
  async createEnvLog(@Payload() dto: EnvLogReqDto, @Ctx() context: MqttContext) {
    console.log(`topic: ${context.getTopic()}`);
    console.log(`env dto.temperatureSht: ${dto.temperatureSht}`);
    console.log(`env dto.humidity: ${dto.humidity}`);
    console.log(`env dto.temperatureQmp: ${dto.temperatureQmp}`);
    console.log(`env dto.pressure: ${dto.pressure}`);

    const macAddress: string | undefined = context.getTopic().split('/')[2];
    if (!macAddress) {
      throw new MacAddressRequiredMqttException();
    }

    try {
      // service側がcontrollerの都合であるreqDtoを受け取るのは厳密には間違いで、
      // service層（ユースケース、ビジネスロジック）として必要なものをservice側で定義してそれを受け取るべき
      await this.appService.recordEnvLog(macAddress, dto); // FIX: dtoの中に必要なものは全部あるが、責務を明瞭にすべきか？
    } catch (error) {
      if (error instanceof DeviceNotFoundError) {
        throw new DeviceNotFoundMqttException(macAddress);
      }

      throw error;
    }
  }
}
