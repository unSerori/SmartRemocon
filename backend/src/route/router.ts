import express from 'express'; // Expressライブラリをインポート（Node.jsのWebアプリケーションフレームワーク）

export function routing(app: express.Express) {
  app.get('/test', async (req, res) => {
    // ex: http://localhost:8000/test?key=value
    console.log('ok');
    res.json(req.query);
  });
  app.get('', async (_req, _res) => {
    console.log('/ ok');
  });

  // TODO: 将来的にはMQTTにするが、一旦HTTPで想定される値を受け取るようにする
  app.post('/env', async (req, res) => {
    console.log(req.body);
    res.status(200).json('');
  });

  app.get('/env-logs', async (req, res) => {
    console.log('/env-logs ok?');

    res.json(req.query);
  });
}
