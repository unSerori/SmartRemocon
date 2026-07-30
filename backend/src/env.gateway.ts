import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ENV_LOG_CREATED } from './env.events.js';
import { Server } from 'socket.io';
import type { EnvLog } from './generated/prisma/client.js';

@WebSocketGateway()
export class EnvGateway {
  // TODO: コンストラクタを作成（DBに保存されたものを返すため、Serviceを受け取る）

  @WebSocketServer()
  server!: Server; // NOTE: NestJSが初期化時にHTTPサーバへアタッチ済みのsockdet.io serverインスタンスを後から代入する。

  @OnEvent(ENV_LOG_CREATED)
  handleEnvLogCraeted(payload: EnvLog) {
    this.server.emit('env_log_update', payload);
  }
}
