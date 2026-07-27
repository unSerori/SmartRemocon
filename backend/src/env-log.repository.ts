import { Injectable } from '@nestjs/common';
import { EnvLog, Prisma } from './generated/prisma/client.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class EnvLogRepo {
  constructor(private prisma: PrismaService) {}

  async add(envlog: Prisma.EnvLogCreateInput): Promise<EnvLog> {
    return await this.prisma.envLog.create({ data: envlog });
  }

  // 取得処理
  async list(limit?: number): Promise<EnvLog[]> {
    return await this.prisma.envLog.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
