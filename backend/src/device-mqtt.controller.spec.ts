import { Test, TestingModule } from '@nestjs/testing';
import { DeviceMqttController } from './device-mqtt.controller.js';

describe('DeviceController', () => {
  let controller: DeviceMqttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceMqttController],
    }).compile();

    controller = module.get<DeviceMqttController>(DeviceMqttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
