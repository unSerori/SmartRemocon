import { Inject, Injectable } from '@nestjs/common';
import { DeviceRepo } from './device.repository.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Device } from './generated/prisma/client.js';
import { DeviceRegisterReqDto } from './dto/req/device.js';
import { DEVICE_REGISTER } from './device.events.js';
import { retry } from 'rxjs';

function buildDefaultDeviceName(macAddress: string): string {
  const lastTwoOctets = macAddress.split(':').slice(-2).join('');
  return `Device-${lastTwoOctets}`;
}

@Injectable()
export class DeviceService {
  constructor(
    private readonly deviceRepo: DeviceRepo,
    private readonly eventEmmitter: EventEmitter2,
  ) {}

  async registerDevice(data: DeviceRegisterReqDto): Promise<Device> {
    const name = data.name?.trim() || buildDefaultDeviceName(data.macAddress);

    const savedData = await this.deviceRepo.upsertByClientId(
      data.macAddress,
      {
        macAddress: data.macAddress,
        ipAddress: data.ipAddress,
        name,
        registerdAt: new Date(),
      },
      {
        ipAddress: data.ipAddress,
        // userが手動（dashboard）で設定したものを採用したいため、nameは初回登録時のみ
      },
    );
    console.log('DB ok.');

    // 成功したらwsのイベントを発火させてfrontendに反映
    this.eventEmmitter.emit(DEVICE_REGISTER, savedData);

    return savedData;
  }

  // async listDevices(): Promise<Device[]> {
  //   return await this.deviceRepo.list();
  // }

  async listDevices(): Promise<Device[]> {
    return await this.deviceRepo.list();
  }
}
