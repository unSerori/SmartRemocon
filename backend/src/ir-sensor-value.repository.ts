import { Injectable } from '@nestjs/common';
import { Device, IrSensorValue, Prisma } from './generated/prisma/client.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class IrSensorValueRepo {
  constructor(private prisma: PrismaService) {}

  async add(data: Prisma.IrSensorValueCreateInput): Promise<IrSensorValue> {
    return await this.prisma.irSensorValue.create({ data, include: { device: true } });
  }

  async list(): Promise<IrSensorValue[]> {
    return await this.prisma.irSensorValue.findMany({
      include: { device: true }, // TODO:
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number): Promise<IrSensorValue> {
    return await this.prisma.irSensorValue.delete({
      where: { id },
    });
  }
}
