// ./network/MqttEnvSender.cpp

#include <ArduinoJson.h>
#include "network/MqttEnvSender.h"

MqttEnvSender::MqttEnvSender(std::string protocol, std::string host, uint16_t port, std::string topic, String client_id, INetworkStatus& network_status)
    : protocol_(protocol),
      host_(host),
      port_(port),
      topic_(topic),
      client_id_(client_id),
      network_status_(network_status),
      wifi_client_(),
      mqtt_client_(wifi_client_)
    {}

bool MqttEnvSender::ensureConnected() {
    if (!network_status_.isConnected())
    {
        Serial.println("WiFi connection failed.");
        return false;
    }

    if (mqtt_client_.connected())
    {
        return true;
    }

    mqtt_client_.setServer(host_.c_str(), port_);
    if (!mqtt_client_.connect(client_id_.c_str()))
    {
        Serial.printf("MQTT connection failed. Status: %d\n", mqtt_client_.state());
        return false;
    }
    Serial.println("MQTT connected.");
    return true;
}

bool MqttEnvSender::send(const EnvData& data) {
    // ensure呼び出す
    if (!ensureConnected())
    {
        return false;
    }

    JsonDocument doc;
    doc["temperatureSht"] = data.temperature_sht;
    doc["humidity"] = data.humidity;
    doc["temperatureQmp"] = data.temperature_qmp;
    doc["pressure"] = data.pressure;
    String json;
    serializeJson(doc, json);

    bool ok = mqtt_client_.publish(topic_.c_str(), json.c_str());
    Serial.printf("MQTT publish result: %s.\n", ok? "success": "failed");
    return ok;
}