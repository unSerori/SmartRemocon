import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostEnvDTO {
  // @IsNumber({}, {})
  // @IsNotEmpty()
  temperatureSht!: number; // CONTEXT: DTOとして後から設定されるため初期値不要

  @IsNumber({}, {})
  @IsNotEmpty()
  humidity!: number;

  @IsNumber({}, {})
  @IsNotEmpty()
  temperatureQmp!: number;

  @IsNumber({}, {})
  @IsNotEmpty()
  pressure!: number;
}
