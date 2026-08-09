import { Controller, Get, Query } from '@nestjs/common';
import { DeviceService } from './device.service.js';
import { Device } from './generated/prisma/client.js';

@Controller()
export class DeviceHttpController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('devices')
  async indexDevices(): Promise<Device[]> {
    // TODO: @Query() filterを使って`?filter={collectMetrics:true}`を取得し、フィルターする
    // TODO: ただし、今はcollectMetricsをUI側で操作して変更する方法がないため、後回し

    return await this.deviceService.listDevices();
  }
}
