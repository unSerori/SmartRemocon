import { Test, TestingModule } from '@nestjs/testing';
import { AppMqttController } from './app-mqtt.controller.js';
import { AppService } from './app.service.js';

describe('AppMqttController', () => {
  let appController: AppMqttController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppMqttController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppMqttController>(AppMqttController);
  });

  // TODO: リポ層の呼び出し・wsイベント発火という副作用をモックでテスト
  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
});
