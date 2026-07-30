// ./main.cpp

// HACK: WiFi接続はサイト経由にしたい。
// HACK: 接続先ホストはどう扱う？

#include <M5Unified.h>
#include <ESPmDNS.h>
#include <WiFi.h> // あとで消す
#include "credentials.h"
#include "sensor/EnvSensor.h"
#include "network/HttpEnvSender.h"
#include "network/WiFiConnector.h"
#include "usecase/SendEnvDataUseCase.h"

// ピン番号をマクロで定義
//

// 変数宣言
//

// オブジェクト作成
EnvSensor env_sensor;
WiFiConnector wifi_connector;
HttpEnvSender env_sender("http", HOST, 8080, "/api/env", wifi_connector);
SendEnvDataUseCase send_env_data_use_case(env_sensor, env_sender);

void setup() {
  Serial.begin(115200);

  auto cfg = M5.config();
  M5.begin(cfg);

  env_sensor.begin();

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
}

void loop() {
  M5.update();

  if (M5.BtnC.wasPressed())
  {
    send_env_data_use_case.execute();
  }
}
