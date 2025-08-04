import { Body, Controller, Get, Post } from '@nestjs/common';
import type { EnvLog } from './app.service';
import { PostEnvDTO } from './dto/req';
import { AppService } from './app.service';

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

  @Post('env')
  postEnv(@Body() body: PostEnvDTO): EnvLog {
    console.log('body.temperatureSht: ', body.temperatureSht);

    return this.appService.getEnv(body);
  }
  @Get('env-logs')
  getEnvLogs(): EnvLog[] {
    console.log('/env-logs ok!');

    return this.appService.getEnvLogs();
  }
}
