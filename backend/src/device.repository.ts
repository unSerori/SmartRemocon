import { Injectable } from '@nestjs/common';
import { Device, Prisma } from './generated/prisma/client.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class DeviceRepo {
  constructor(private prisma: PrismaService) {}

  async getByMaca(macAddress: string): Promise<Device | null> {
    return await this.prisma.device.findUnique({
      where: { macAddress: macAddress },
    });
  }

  async upsertByClientId(
    where: Prisma.DeviceWhereUniqueInput,
    create: Prisma.DeviceCreateInput,
    update: Prisma.DeviceUpdateInput,
  ): Promise<Device> {
    return await this.prisma.device.upsert({
      where,
      create,
      update,
    });
  }

  // TODO: limitとか
  async list(): Promise<Device[]> {
    return await this.prisma.device.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // // 取得処理
  // async list(limit?: number): Promise<EnvLog[]> {
  //   return await this.prisma.envLog.findMany({
  //     take: limit,
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });
  // }
}
