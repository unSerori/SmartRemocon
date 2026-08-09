import { RpcException } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';

export class RpcValidationException extends RpcException {
  constructor(message: string | object) {
    super({
      code: 'VALIDATION_ERROR',
      message,
    });
  }
}
