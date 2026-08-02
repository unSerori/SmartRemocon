// ./main.cpp

// HACK: WiFi接続はサイト経由にしたい。
// HACK: 接続先ホストはどう扱う？

#include <M5Unified.h>
#include <ESPmDNS.h>
#include <WiFi.h> // あとで消す
#include <IRremote.hpp> // hpp
#include "credentials.h"
#include "sensor/EnvSensor.h"
// #include "network/HttpEnvSender.h"
#include "network/MqttEnvSender.h"
#include "network/WiFiConnector.h"
#include "usecase/SendEnvDataUseCase.h"

// ピン番号をマクロで定義
#define IR_RECEIVE_PIN 36 // 受信: 36番ピン
#define IR_SEND_PIN 26 // 送信: 26番ピン

// 変数宣言
IRData last_ir_data;

// オブジェクト作成
EnvSensor env_sensor;
WiFiConnector wifi_connector;
// HttpEnvSender env_sender("http", HOST, 8080, "/api/env", wifi_connector);
std::optional<MqttEnvSender> env_sender;
std::optional<SendEnvDataUseCase> send_env_data_use_case;

void setupEnvSending(){ // `mosquitto_sub -h localhost -p 1883 -t "smart_remocon/devices/+/env" -v`
  String client_id = WiFi.macAddress();
  Serial.printf("client_id: %s\n", client_id.c_str());

  std::string topic = "smart_remocon/devices/" + std::string(client_id.c_str()) + "/env";
  Serial.printf("topic: %s\n", topic.c_str());

  env_sender.emplace("mqtt", HOST, MQTT_PORT, topic, client_id, wifi_connector);
  send_env_data_use_case.emplace(env_sensor, *env_sender);
}

void setup() {
  Serial.begin(115200);

  auto cfg = M5.config();
  M5.begin(cfg);

  env_sensor.begin(); // TODO: これもっと下かも。本体の初期化、ネットワーク確立、センサー類起動、

  for (;;)
  {
    wifi_connector.connect(WIFI_SSID, WIFI_PASS);
    if (wifi_connector.waitForConnection(5000))
    {
      Serial.println("WiFi connection success!");
      break;
    }
    Serial.printf("WiFi connection failed: %d. Retrying...\n", WiFi.status());
  }

  // mDNS初期化
  while (!MDNS.begin(DEVICE_NAME))
  {
    Serial.println("Error staring mDNS.");
    delay(1000);
  }
  Serial.println("mDNS started!");
  Serial.printf("WiFi.localIP(): %s\n", WiFi.localIP().toString().c_str());

  // TODO: ここに移動かも

  setupEnvSending();

  IrSender.begin(IR_SEND_PIN);
  IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK); 
}

void loop() {
  M5.update();

  // Aを押すと取得
  if (IrReceiver.decode()) { 
    if (M5.BtnA.isPressed()){
      if (IrReceiver.decodedIRData.decodedRawData != 0) // HACK: これは多分ブス
      {
        last_ir_data = IrReceiver.decodedIRData;
        Serial.println(last_ir_data.decodedRawData, HEX);

        IrReceiver.printIRResultShort(&Serial);  // 受信したデータの簡潔な概要を表示
        IrReceiver.printIRSendUsage(&Serial);    // 受信した信号を送信するためのコードを表示
      }
    }
    IrReceiver.resume();
  }

  // // B押したら送信
  // if (M5.BtnB.wasPressed())
  // {
  //   Serial.println("IR Send: Start.");
  //   IrSender.sendNEC(last_ir_data.address, last_ir_data.command, 0);
  //   Serial.println("IR Send: End.");
  // }
  // B押したら送信
  if (M5.BtnB.wasPressed())
  {
    Serial.println("IR Send: Start.");
    // IrSender.sendNEC(last_ir_data.address, last_ir_data.command, 0);
    IrSender.sendPulseDistanceWidth(
      38,                     // 赤外線搬送波周波数（kHz）
      9000, 4500,             // リーダーパルス（ON, OFF）
      560, 1690,              // "1" のパルス幅（ON, OFF）
      560, 550,               // "0" のパルス幅（ON, OFF）
      last_ir_data.decodedRawData,          // 送信データ（48ビット）
      48,                     // データ長（ビット数）
      PROTOCOL_IS_LSB_FIRST,  // LSBファースト
      0,                      // 繰り返し周期（0 = 送信しない）
      2                       // 送信回数（リモコンのように2回送る）
  );
    Serial.println("IR Send: End.");
  }

  // C押したら環境値送信
  if (M5.BtnC.wasPressed())
  {
    send_env_data_use_case->execute();
  }
}
