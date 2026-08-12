import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class IrSensorValueLearnReqDto {
  @IsNumber()
  @IsNotEmpty()
  sensorId!: number;
}
