import { Test, TestingModule } from '@nestjs/testing';
import { EnvGateway } from './env.gateway.js';

describe('EnvGateway', () => {
  let gateway: EnvGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvGateway],
    }).compile();

    gateway = module.get<EnvGateway>(EnvGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
