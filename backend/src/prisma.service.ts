import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { getDatabaseEnv } from './config/env.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // const connectionString = process.env.DATABASE_URL || '';
    const env = getDatabaseEnv();
    const adapter = new PrismaMariaDb({
      host: env.host,
      port: env.port,
      user: env.user,
      password: env.password,
      database: env.database,
      allowPublicKeyRetrieval: true,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
