import express from 'express'; // Expressライブラリをインポート（Node.jsのWebアプリケーションフレームワーク）

type EnvLog = {
  id: number;
  // device: Device;
  temperatureSht: number;
  humidity: number;
  temperatureQmp: number;
  pressure: number;
  createdAt: Date;
  updatedAt: Date;
};

const testDataList: EnvLog[] = [];

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
    console.log(testDataList);

    const testData: EnvLog = {
      id: testDataList.length,
      // device: Device;
      temperatureSht: req.body['temperature_sht'],
      humidity: req.body['humidity'],
      temperatureQmp: req.body['temperature_qmp'],
      pressure: req.body['pressure'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    testDataList.push(testData);
    res.status(200).json(testDataList);
  });

  app.get('/env-logs', async (req, res) => {
    console.log('/env-logs ok!');
    console.log('testData: ', testDataList); // console.log(`testData: ${testDataList}`);

    res.json(testDataList);
  });
}
