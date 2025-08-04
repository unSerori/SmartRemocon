import { Injectable, Req, Body } from '@nestjs/common';
import { PostEnvDTO } from './dto/req';

export type EnvLog = {
  id: number;
  // device: Device;
  temperatureSht: number;
  humidity: number;
  temperatureQmp: number;
  pressure: number;
  createdAt: Date;
  updatedAt: Date;
};

const testDataList: EnvLog[] = [];

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTest(): string {
    console.log('ok');
    return 'Good By;;';
  }

  getEnv(reqEnvData: PostEnvDTO): EnvLog {
    console.log('reqEnvData: ', reqEnvData);

    console.log('reqEnvData.temperatureSht: ', reqEnvData.temperatureSht);

    const testData: EnvLog = {
      id: testDataList.length,
      // device: Device;
      temperatureSht: reqEnvData.temperatureSht,
      humidity: reqEnvData.humidity,
      temperatureQmp: reqEnvData.temperatureQmp,
      pressure: reqEnvData.pressure,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    testDataList.push(testData);

    console.log('testDataList: ', testDataList);

    return testData;
  }

  getEnvLogs(): EnvLog[] {
    console.log('testData: ', testDataList);
    return testDataList;
  }
}
