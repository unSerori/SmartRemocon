import { Test, TestingModule } from '@nestjs/testing';
import { AppHttpController } from './app-http.controller.js';
import { AppService } from './app.service.js';

describe('AppHttpController', () => {
  let appController: AppHttpController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppHttpController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppHttpController>(AppHttpController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
