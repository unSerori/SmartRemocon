import { OnEvent } from '@nestjs/event-emitter';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DEVICE_REGISTER } from './device.events.js';
import { type Device } from './generated/prisma/client.js';

@WebSocketGateway()
export class DeviceGateway {
  @WebSocketServer()
  server!: Server; // NOTE: NestJSが初期化時にHTTPサーバへアタッチ済みのsockdet.io serverインスタンスを後から代入する。

  @OnEvent(DEVICE_REGISTER)
  handleDeviceRegister(payload: Device) {
    console.log('ここはgateway');

    this.server.emit('device_update', payload);
    console.log('emitしたよ');
  }
}
