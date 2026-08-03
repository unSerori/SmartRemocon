import { OnEvent } from '@nestjs/event-emitter';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DEVICE_REGISTER } from './device.events.js';
import { type IrSensorValue } from './generated/prisma/client.js';
import { IR_SENSOR_LEARNED } from './ir-sensor-value.events.js';

@WebSocketGateway()
export class IrSensorValueGateway {
  @WebSocketServer()
  server!: Server; // NOTE: NestJSが初期化時にHTTPサーバへアタッチ済みのsockdet.io serverインスタンスを後から代入する。

  @OnEvent(IR_SENSOR_LEARNED)
  handleIrSensorLearned(payload: IrSensorValue) {
    console.log('ここはgateway');

    this.server.emit('ir_sensor_update', payload);
  }
}
