// ./network/MqttConnection.h

#pragma once

#include <Arduino.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include "network/INetworkStatus.h"

class MqttConnectionOld
{
private:
    std::string protocol_; // mqtt or mqtts
    std::string host_;
    uint16_t port_;
    String client_id_; // 接続時に名乗るデバイスごとに一意なクライアントID（mac address）

    INetworkStatus& network_status_; // 接続確認
    WiFiClient wifi_client_; // pubsubclientが必要とする内部実装
    PubSubClient mqtt_client_;

    std::function<void(const std::string&, const std::string&)> on_message_;

    bool ensureConnected();

public:
    MqttConnectionOld(std::string protocol, std::string host, uint16_t port, String client_id, INetworkStatus& network_status); // メンバ変数の初期化

    bool publish(const std::string& topic, const String& payload);
    bool subscribe(const std::string& topic);
    void setMessageHandler(std::function<void(const std::string&, const std::string&)> handler);
    void loop(); // TODO: これをmain.cppのloop()内で呼ぶ
    void handleMessage(char* topic, byte* payload, unsigned int length); // いったんpublic

};
