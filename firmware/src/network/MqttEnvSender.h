// ./network/MqttEnvSender.h

# pragma once

#include <Arduino.h>
#include <string>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include "network/IEnvSender.h"
#include "network/INetworkStatus.h"

class MqttEnvSender : public IEnvSender
{
private:
    std::string protocol_; // mqtt or mqtts
    std::string host_; // ホスト先
    uint16_t port_;// ポート
    std::string topic_;// publish先のトピック
    String client_id_; // 接続時に名乗るデバイスごとに一意なクライアントID（mac address）
    INetworkStatus& network_status_; // 接続確認

    WiFiClient wifi_client_;
    PubSubClient mqtt_client_;

    bool ensureConnected();

public:
    MqttEnvSender(std::string protocol, std::string host, uint16_t port, std::string topic, String client_id, INetworkStatus& network_status); // メンバ変数の初期化
    ~MqttEnvSender() override = default;

    bool send(const EnvData& data) override;
};
