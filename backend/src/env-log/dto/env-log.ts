import { EnvLog } from '../../generated/prisma/client.js';

export class EnvLogListResDto {
  constructor(
    public id: number,
    public temperatureSht: number,
    public humidity: number,
    public temperatureQmp: number,
    public pressure: number,
    public createdAt: Date,
  ) {}

  static fromEntity(envLog: EnvLog): EnvLogListResDto {
    return new EnvLogListResDto(
      envLog.id,
      envLog.temperatureSht,
      envLog.humidity,
      envLog.temperatureQmp,
      envLog.pressure,
      envLog.createdAt,
    );
  }

  static fromEntities(envLogs: EnvLog[]): EnvLogListResDto[] {
    return envLogs.map((envlog) => this.fromEntity(envlog));
  }
}
