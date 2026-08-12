import { Injectable } from '@nestjs/common';
import { IrSensorValue, Prisma } from './generated/prisma/client.js';
import { PrismaService } from './prisma.service.js';

// NOTE: prismaというORMの都合がサービスに漏れ出ないように、
// NOTE: 漏れ出てしまうユースケースの場合は、受取用の薄い層（受け取り用の型）を作る。
export type IrSensorValueCreateData = {
  deviceId: number;
  name: string;
  data: string;
};

@Injectable()
export class IrSensorValueRepo {
  constructor(private prisma: PrismaService) {}

  async list(): Promise<IrSensorValue[]> {
    return await this.prisma.irSensorValue.findMany({
      include: { device: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(sensor: IrSensorValueCreateData): Promise<IrSensorValue> {
    return await this.prisma.irSensorValue.create({
      data: {
        device: { connect: { id: sensor.deviceId } },
        name: sensor.name,
        data: sensor.data,
      },
      include: { device: true },
    });
  }
}
