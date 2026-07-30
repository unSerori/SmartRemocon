import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class EnvGateway {
  // TODO: コンストラクタを作成（DBに保存されたものを返すため、Serviceを受け取る）

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
