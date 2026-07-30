// ./network/HttpEnvSender.cpp

#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "network/HttpEnvSender.h"

HttpEnvSender::HttpEnvSender(std::string protocol, std::string host, uint16_t port, std::string path, INetworkStatus& network_status)
    : protocol_(protocol), host_(std::move(host)), port_(port), path_(std::move(path)), network_status_(network_status) {}

bool HttpEnvSender::send(const EnvData& data) {
    if (!network_status_.isConnected())
    {
        Serial.println("WiFi connection failed.");
        return false;
    }

    IPAddress resolved_ip;
    if (!WiFi.hostByName(host_.c_str(), resolved_ip))
    {
        Serial.println("Host resolution failed.");
        return false;
    }
    
    auto url = protocol_ + "://" + resolved_ip.toString().c_str() + ":" + std::to_string(port_) + path_;
    Serial.printf("url: %s\n", url.c_str());

    JsonDocument doc;
    doc["temperatureSht"] = data.temperature_sht;
    doc["humidity"] = data.humidity;
    doc["temperatureQmp"] = data.temperature_qmp;
    doc["pressure"] = data.pressure;
    String json;
    serializeJson(doc, json);


    HTTPClient client;
    client.begin(url.c_str());
    client.addHeader("Content-Type", "application/json");
    int code = client.POST(json);
    client.end();

    Serial.printf("code: %d\n", code);
    return code >= 200 || code < 300;
}