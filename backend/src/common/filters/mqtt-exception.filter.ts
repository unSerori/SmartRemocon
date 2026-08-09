import { ArgumentsHost, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export class MqttExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(MqttExceptionFilter.name);

  override catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) {
      this.logger.warn(exception.getError());
      return super.catch(exception, host);
    }

    this.logger.error(exception);
    const fallback = new RpcException({
      code: 'INTERNAL_ERROR',
      message: 'Unexception error occurd.',
    });
    return super.catch(fallback, host);
  }
}
