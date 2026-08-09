import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { IsIP, IsNotEmpty, IsString, validateSync } from 'class-validator';

export class DeviceRegisterReqDto {
  @IsString()
  @IsNotEmpty()
  macAddress!: string;

  @IsIP()
  @IsNotEmpty()
  ipAddress!: string;

  @IsString()
  name!: string;

  // static fromPayload(payload: DeviceRegisterPayload): DeviceRegisterReqDto {
  //   const dto = plainToInstance(DeviceRegisterReqDto, payload);
  //   const errors = validateSync(dto);
  //   if (errors.length > 0) {
  //     throw new RpcException(`Invalid payload: ${JSON.stringify(errors)}`); // FIX: 例外ｍｓｇｓ
  //   }

  //   return dto;
  // }
}
