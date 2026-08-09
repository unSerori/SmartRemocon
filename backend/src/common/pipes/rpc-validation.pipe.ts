import { Inject, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { formatValidationErrors } from './format-validation-errors.js';
import { RpcValidationException } from '../exceptions/rpc-validation.exception.js';

function createExceptionFactory(disableErrorMessages?: boolean) {
  return (errors: ValidationError[] = []) => {
    if (disableErrorMessages) {
      return new RpcValidationException('Validation failed.');
    }

    return new RpcValidationException(formatValidationErrors(errors));
  };
}

@Injectable()
export class MqttValidationPipe extends ValidationPipe {
  constructor(disableErrorMessages = false) {
    super({
      whitelist: true,
      forbidNonWhitelisted: false, // 余計なフィールドはエラーにしない。whiltelistですでに除外しているが、デフォルトfalseを明示している。
      exceptionFactory: createExceptionFactory(disableErrorMessages),
    });
  }
}
