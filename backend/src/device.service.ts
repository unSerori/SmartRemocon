import { Inject, Injectable } from '@nestjs/common';
import { DeviceRepo } from './device.repository.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Device } from './generated/prisma/client.js';
import { DeviceRegisterReqDto } from './dto/req/device.js';
import { DEVICE_REGISTER } from './device.events.js';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DeviceService {
  constructor(
    private readonly deviceRepo: DeviceRepo,
    private readonly eventEmmitter: EventEmitter2,
  ) {}

  async registerDevice(data: DeviceRegisterReqDto): Promise<Device> {
    // TODO: ここでDBに登録
    const savedData = await this.deviceRepo.upsertByClientId(
      { macAddress: data.macAddress },
      {
        macAddress: data.macAddress,
        ipAddress: data.ipAddress,
        name: data.name,
        registerdAt: new Date(),
      },
      { ipAddress: data.ipAddress },
    );
    console.log('DB ok.');

    // TODO: 成功したらwsのイベントを発火させてfrontendに反映
    this.eventEmmitter.emit(DEVICE_REGISTER, savedData);

    return savedData;
  }

  async listDevices(): Promise<Device[]> {
    return await this.deviceRepo.list();
  }
}
