// ./main.cpp

// HACK: WiFi接続はサイト経由にしたい。
// HACK: 接続先ホストはどう扱う？

// ライブラリが利用する定数をあらかじめ設定
#define RECORD_GAP_MICROS 50000
#define RAW_BUFFER_LENGTH 1024

#include <M5Unified.h>
#include <ESPmDNS.h>
#include <WiFi.h>
#include <IRremote.hpp> // hpp
#include "credentials.h"
#include "network/MqttConnection.h"
#include "network/MqttSender.h"
#include "sensor/env/EnvSensor.h"
#include "sensor/env/EnvData.h"
#include "device/DeviceRegisterData.h"
#include "network/WiFiConnector.h"
#include "usecase/SendEnvDataUseCase.h"

// ピン番号をマクロで定義
#define IR_RECEIVE_PIN 36 // 受信: 36番ピン
#define IR_SEND_PIN 26 // 送信: 26番ピン

// 変数宣言
IRData last_ir_data;
int learning_sensor_id = -1;

// オブジェクト作成
EnvSensor env_sensor;
WiFiConnector wifi_connector;

std::optional<MqttConnection> mqtt_connection;

std::optional<MqttSender<EnvData>> env_sender;
std::optional<SendEnvDataUseCase> send_env_data_use_case;

std::optional<MqttSender<DeviceRegisterData>> register_sender;

std::string removeChar(std::string str, char target) {
  str.erase(std::remove(str.begin(), str.end(), target), str.end());
  return str;
}

void setupMqttConnection(){
  String client_id = WiFi.macAddress();
  Serial.printf("client_id: %s\n", client_id.c_str());
  mqtt_connection.emplace("mqtt", HOST, MQTT_PORT, client_id, wifi_connector);
}

// TODO: 順序
void setupEnvSending(){ // `mosquitto_sub -h localhost -p 1883 -t "smart_remocon/devices/+/env" -v`
  std::string topic = "smart_remocon/devices/" + std::string(WiFi.macAddress().c_str()) + "/env";
  Serial.printf("topic: %s\n", topic.c_str());
  env_sender.emplace(*mqtt_connection, topic);

  send_env_data_use_case.emplace(env_sensor, *env_sender);
}

void setupDeviceRegistering() {
  std::string topic = "smart_remocon/devices/" + std::string(WiFi.macAddress().c_str()) + "/register";
  Serial.printf("topic: %s\n", topic.c_str());

  register_sender.emplace(*mqtt_connection, topic);

  DeviceRegisterData data;
  data.mac_address = WiFi.macAddress().c_str();
  data.ip_address = WiFi.localIP().toString().c_str();
  data.name = DEVICE_NAME;

  bool ok = register_sender->send(data);
  Serial.printf("Register send: %s.\n", ok ? "success": "failed");
}

// Ir関連処理をトリガーするための購読登録
void setupIrSubscriptions() {
  // TODO: 
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
  std::string macAddress(WiFi.macAddress().c_str());

  // mDNS初期化
  std::string macAddressNoColon = removeChar(macAddress, ':');
  std::string mdnsHostname = "m5go-" + macAddressNoColon;
  while (!MDNS.begin(mdnsHostname.c_str()))
  {
    Serial.println("Error staring mDNS.");
    delay(1000);
  }
  Serial.println("mDNS started!");
  Serial.printf("WiFi.localIP(): %s\n", WiFi.localIP().toString().c_str());

  // TODO: ここに移動かも

  setupMqttConnection();
  setupDeviceRegistering();
  setupEnvSending();
  // setupIrSubscriptions();

  IrSender.begin(IR_SEND_PIN);
  IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK); 
}

void loop() {
  M5.update();
  mqtt_connection->loop();

  // Aを押すと取得
  if (IrReceiver.decode()) { 
    if (M5.BtnA.isPressed()){
      if (IrReceiver.decodedIRData.decodedRawData != 0) // HACK: これは多分ブス
      {
        last_ir_data = IrReceiver.decodedIRData;
        Serial.println(last_ir_data.decodedRawData, HEX);

        IrReceiver.printIRResultShort(&Serial);  // 受信したデータの簡潔な概要を表示
        IrReceiver.printIRSendUsage(&Serial);    // 受信した信号を送信するためのコードを表示
        IrReceiver.printIRResultRawFormatted(&Serial, true); // 信号の生データを整形して表示
      }
    }
    IrReceiver.resume();
  }

  // B押したら送信
  if (M5.BtnB.wasPressed())
  {
    Serial.println("IR Send: Start.");
    // IrSender.sendNEC(last_ir_data.address, last_ir_data.command, 0); // これは動作しなかった。
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

// // DAIKIN ON
// uint16_t rawIRTimingsOn[643] = {480,420, 430,420, 430,470, 430,420, 430,420, 430,12770, 3480,1770, 380,1370, 380,470, 380,520, 380,470, 380,1370, 380,470, 430,470, 380,470, 380,470, 430,1320, 430,470, 380,1320, 430,1320, 430,470, 380,1370, 380,1320, 430,1320, 380,1370, 380,1370, 380,470, 380,520, 380,1320, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 430,470, 380,470, 380,520, 380,1320, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 430,470, 380,470, 380,470, 430,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,1370, 380,1370, 380,470, 380,470, 430,1320, 380,520, 380,470, 380,470, 430,12770, 3480,1770, 380,1370, 380,470, 380,470, 430,470, 380,1370, 380,470, 380,470, 430,470, 380,470, 430,1320, 380,470, 430,1320, 430,1320, 380,520, 380,1320, 430,1320, 380,1370, 380,1370, 380,1370, 380,470, 380,470, 430,1320, 430,470, 380,470, 380,470, 430,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,1320, 430,470, 380,470, 430,1320, 380,1370, 380,1370, 380,470, 380,520, 380,470, 380,470, 430,470, 380,1370, 380,1320, 430,1320, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 430,1320, 380,1370, 380,1370, 380,1370, 380,1320, 430,1320, 380,520, 380,1320, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,470, 430,1320, 380,1370, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,1370, 380,1370, 380,470, 380,520, 380,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,1320, 430,470, 380,470, 380,520, 380,470, 380,470, 430,1320, 380,1370, 380,520, 380,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,1370, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,1370, 380,470, 380,520, 380,1320, 430,470, 380,1370, 380,1370, 380,1320, 380};
// // DAIKIN OFF
// uint16_t rawIRTimingsOff[643] = {480,420, 430,420, 430,420, 430,470, 430,420, 430,12770, 3480,1770, 380,1370, 380,470, 380,470, 430,470, 380,1370, 380,470, 380,470, 430,470, 380,470, 430,1320, 380,520, 380,1320, 430,1320, 380,520, 380,1320, 430,1320, 430,1320, 380,1370, 380,1370, 380,470, 380,470, 430,1320, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,1320, 380,520, 380,470, 380,470, 430,470, 380,470, 430,470, 380,470,380,470, 430,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 380,470, 380,520, 330,520, 380,470, 380,520, 380,470, 380,520, 330,520, 380,470, 380,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,520, 380,470, 380,520, 330,520, 380,520, 330,520, 380,470, 380,1370, 380,1370, 380,470, 380,520, 330,1420, 330,520, 380,470, 380,520, 330,12770, 3480,1770, 380,1370, 380,470, 380,470, 430,470, 380,1370, 380,470, 380,520, 380,470, 380,470, 430,1320, 380,520, 380,1320, 430,1320, 380,520, 380,1320, 430,1320,380,1370, 380,1370, 380,1370, 380,470, 380,470, 430,1320, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470,380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,1370, 380,1320, 430,1320, 380,520, 380,470, 380,470, 430,470, 380,470, 430,1320, 380,1370, 380,1370, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,1370, 380,1320, 430,1320, 380,1370, 380,1370, 380,1370, 380,470, 380,1370, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,1370, 380,1370, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,1320, 430,1320, 380,520, 380,470, 380,520, 380,470, 380,470, 380,520, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,1370, 380,470, 430,470, 380,470, 380,520, 380,470, 380,1370, 380,1370, 380,470, 380,520, 380,470, 380,470, 380,520, 380,470, 380,520, 380,1320, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,470, 380,520, 380,470, 380,470, 430,470, 380,1370, 380,470, 380,1370, 380,1370, 380,1370, 380};

// void loop() {
//   M5.update();
//   mqtt_connection->loop();

//   if (IrReceiver.decode())
//   {
//     if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_WAS_OVERFLOW)
//     {
//       Serial.println("Warning: 受信バッファがオーバーフロー");
//     }
    
//     Serial.println("=== decode() ===");

//     IrReceiver.printIRResultShort(&Serial);  // 受信したデータの簡潔な概要を表示
//     IrReceiver.printIRSendUsage(&Serial);    // 受信した信号を送信するためのコードを表示
//     IrReceiver.printIRResultRawFormatted(&Serial, true); // 信号の生データを整形して表示

//     Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX); // データの確認

//     IrReceiver.resume();
//   }

//   if (M5.BtnA.wasPressed())
//   {
//     // DAIKINエアコン ON
//     IrSender.sendRaw(rawIRTimingsOn, sizeof(rawIRTimingsOn) / sizeof(rawIRTimingsOn[0]), 38);

//     Serial.println("AC運転ON...送信完了");
//   }

//   if (M5.BtnB.wasPressed())
//   {
//     // DAIKINエアコン OFF
//     IrSender.sendRaw(rawIRTimingsOff, sizeof(rawIRTimingsOff) / sizeof(rawIRTimingsOff[0]), 38);

//     Serial.println("AC運転OFF...送信完了");
//   }
  

//   if (M5.BtnC.wasPressed())
//   {
//     // IRIS OHYAMA照明
//     IrSender.sendPulseDistanceWidth(38, 8950, 4550, 550, 1700, 550, 600, 0x7C000110107651, 56, PROTOCOL_IS_LSB_FIRST, 0, NO_REPEATS);

//     Serial.println("照明点灯...送信完了");
//   }
// }
