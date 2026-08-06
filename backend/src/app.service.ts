import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEnvDTO } from './dto/req_old.js';
import { EnvLogRepo } from './env-log.repository.js';
import { EnvLog, Prisma } from './generated/prisma/client.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ENV_LOG_CREATED } from './env.events.js';
import { EnvLogReqDto } from './dto/req/env-log.js';
import { DeviceRepo } from './device.repository.js';
import { DeviceNotFoundError } from './app/error/device-not-found.error.js';

// export type EnvLog = {
//   id: number;
//   // device: Device;
//   temperatureSht: number;
//   humidity: number;
//   temperatureQmp: number;
//   pressure: number;
//   createdAt: Date;
//   updatedAt: Date;
// };

// const testDataList: EnvLog[] = [];

@Injectable()
export class AppService {
  constructor(
    private readonly envLogRepo: EnvLogRepo,
    private readonly deviceRepo: DeviceRepo,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getTest(): string {
    console.log('ok');
    return 'Good By;;';
  }

  async recordEnvLog(macAddress: string, reqEnvData: EnvLogReqDto): Promise<EnvLog> {
    console.log('reqEnvData: ', reqEnvData);
    console.log('reqEnvData.temperatureSht: ', reqEnvData.temperatureSht);

    const device = await this.deviceRepo.getByMaca(macAddress);
    if (!device) {
      throw new DeviceNotFoundError(macAddress);
    }

    const createData: Prisma.EnvLogCreateInput = {
      deviceId: device.id,
      temperatureSht: reqEnvData.temperatureSht,
      humidity: reqEnvData.humidity,
      temperatureQmp: reqEnvData.temperatureQmp,
      pressure: reqEnvData.pressure,
    };

    const saveLog = await this.envLogRepo.add(createData);
    console.log('Saved to DB: ', saveLog);

    this.eventEmitter.emit(ENV_LOG_CREATED, saveLog);

    return saveLog;
  }

  async fetchEnvLogs(limit?: number): Promise<EnvLog[]> {
    // 型がわからん
    // console.log('testData: ', testDataList);
    const envLogs = await this.envLogRepo.list(limit); // ?: repo層が返す型の確定 // ?: getにはlimitを渡すべきか？このあと返り血をlimitで削減するか？

    return envLogs;
  }
}
