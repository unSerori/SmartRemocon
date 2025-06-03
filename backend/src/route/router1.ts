import express from 'express'; // Expressライブラリをインポート（Node.jsのWebアプリケーションフレームワーク）

export function routing(app: express.Express) {
  app.get('/test', async (req, res) => {
    console.log('ok');
    const unusedVariable: string = '';
    // console.log(req);
    // res.send('test ok!');
  });
}
