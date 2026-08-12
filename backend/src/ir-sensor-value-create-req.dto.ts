import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class DeviceRefDto {
  @IsInt()
  id!: number;
}

export class IrSensorValueCreateReqDto {
  @ValidateNested()
  @Type(() => DeviceRefDto)
  device!: DeviceRefDto;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  data!: string;
}
