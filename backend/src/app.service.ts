import { Injectable } from '@nestjs/common';
import { PostEnvDTO } from './dto/req.js';
import { EnvLogRepo } from './env-log.repository.js';
import { EnvLog, Prisma } from './generated/prisma/client.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ENV_LOG_CREATED } from './env.events.js';

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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getTest(): string {
    console.log('ok');
    return 'Good By;;';
  }

  async createEnvLog(reqEnvData: PostEnvDTO): Promise<EnvLog> {
    console.log('reqEnvData: ', reqEnvData);
    console.log('reqEnvData.temperatureSht: ', reqEnvData.temperatureSht);

    // const envlog: EnvLog = {
    //   id: testDataList.length,
    //   // device: Device;
    //   temperatureSht: reqEnvData.temperatureSht,
    //   humidity: reqEnvData.humidity,
    //   temperatureQmp: reqEnvData.temperatureQmp,
    //   pressure: reqEnvData.pressure,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    // const createData: Prisma.EnvLogsCreateInput = {
    //   temperatureSht: reqEnvData.temperatureSht,
    //   humidity: reqEnvData.humidity,
    //   temperatureQmp: reqEnvData.temperatureQmp,
    //   pressure: reqEnvData.pressure,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    const createData: Prisma.EnvLogCreateInput = {
      deviceId: 1, // TODO: ここはauto_incにすべきか、uuidにすべきか。deviceはauto_incでいいかも。
      temperatureSht: reqEnvData.temperatureSht,
      humidity: reqEnvData.humidity,
      temperatureQmp: reqEnvData.temperatureQmp,
      pressure: reqEnvData.pressure,
    };

    // testDataList.push(testData);
    // TODO: ここでリポジトリ層の登録処理を呼ぶぜ！！！
    const saveLog = await this.envLogRepo.add(createData);
    console.log('Saved to DB: ', saveLog);
    this.eventEmitter.emit(ENV_LOG_CREATED, saveLog);

    // console.log('testDataList: ', testDataList);

    return saveLog;
  }

  async fetchEnvLogs(limit?: number): Promise<EnvLog[]> {
    // 型がわからん
    // console.log('testData: ', testDataList);
    const envLogs = await this.envLogRepo.list(limit); // ?: repo層が返す型の確定 // ?: getにはlimitを渡すべきか？このあと返り血をlimitで削減するか？

    return envLogs;
  }
}
