import { Test, TestingModule } from '@nestjs/testing';
import { DeviceHttpController } from './device-http.controller.js';

describe('DeviceController', () => {
  let controller: DeviceHttpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceHttpController],
    }).compile();

    controller = module.get<DeviceHttpController>(DeviceHttpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
