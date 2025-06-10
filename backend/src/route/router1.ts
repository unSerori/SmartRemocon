import express from 'express'; // Expressライブラリをインポート（Node.jsのWebアプリケーションフレームワーク）

export function routing(app: express.Express) {
  //
  app.get('/test', async (req, res) => {
    // ex: http://localhost:8000/test?key=value
    console.log('ok');
    res.json(req.query);
  });
}
