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

  async updateName(id: number, name: string): Promise<IrSensorValue> {
    return await this.prisma.irSensorValue.update({
      where: { id },
      data: { name },
    });
  }

  async updateData(id: number, data: string): Promise<IrSensorValue> {
    return await this.prisma.irSensorValue.update({
      where: { id },
      data: { data },
    });
  }

  async findByDeviceId(id: number) {
    return await this.prisma.irSensorValue.findUniqueOrThrow({
      where: { id },
      include: { device: true },
    });
  }
}
