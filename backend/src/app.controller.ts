import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostEnvDTO } from './dto/req.js';
import { AppService } from './app.service.js';
import { EnvLogResDto } from './dto/res/env-log.js';

// Request DTO
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): string {
    return this.appService.getTest();
  }

  // TODO: `postEnvLog`に直す
  @Post('env')
  async recordEnvLog(@Body() body: PostEnvDTO) {
    console.log('body.temperatureSht: ', body.temperatureSht);

    const savedData = await this.appService.createEnvLog(body);

    return {
      data: savedData,
    };
  }

  @Get('env-logs')
  async getEnvLogs(@Query('limit') limit?: string) {
    console.log('/env-logs controller!');

    const limitNum = limit ? Number(limit) : undefined;
    const envLogs = await this.appService.fetchEnvLogs(limitNum); // 将来的には、srvから得た成果物を、HTTPレスポンスの形としてDTOをかます

    return EnvLogResDto.fromEntities(envLogs);
  }
}
