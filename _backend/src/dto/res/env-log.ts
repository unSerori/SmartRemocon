// TODO: reqもこっちの構造に変更する。
import { EnvLog } from '../../generated/prisma/client';

export class EnvLogResDto {
  constructor(
    public id: number,
    public temperatureSht: number,
    public humidity: number,
    public temperatureQmp: number,
    public pressure: number,
    public createdAt: Date,
  ) {}

  static fromEntity(envLog: EnvLog): EnvLogResDto {
    return new EnvLogResDto(
      envLog.id,
      envLog.temperatureSht,
      envLog.humidity,
      envLog.temperatureQmp,
      envLog.pressure,
      envLog.createdAt,
    );
  }

  static fromEntities(envLogs: EnvLog[]): EnvLogResDto[] {
    return envLogs.map((envlog) => this.fromEntity(envlog));
  }
}
