// ./network/MqttConnection.h

#pragma once

#include <Arduino.h>
#include <string>
#include <functional>
#include <vector>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include "network/INetworkStatus.h"

class MqttConnection
{
private:
    std::string protocol_; // mqtt or mqtts
    std::string host_;
    uint16_t port_;
    String client_id_; // 接続時に名乗るデバイスごとに一意なクライアントID（mac address）

    INetworkStatus& network_status_; // 接続確認
    WiFiClient wifi_client_; // pubsubclientが必要とする内部実装
    PubSubClient mqtt_client_;

    using MessageCallback = std::function<void(const std::string&, const std::string&)>;
    struct Subscription // 今回はスコープが小さいため抽象的な名詞で十分だが、識別子に対して紐づくもの（拡張性あり）を表したい場合`TopicRoute`とか良さそう
    {
        std::string topic_filter;
        MessageCallback handler; // topicとpayload
    };
    std::vector<Subscription> handlers_;
    
    bool ensureConnected();
    static bool matchesFilter(const std::string& topic, const std::string& topic_filter);

public:
    MqttConnection(std::string protocol, std::string host, uint16_t port, String client_id, INetworkStatus& network_status); // メンバ変数の初期化

    bool publish(const std::string& topic, const String& payload);

    bool subscribe(const std::string& topic_filter);
    void handleMessage(const char* topic, const uint8_t* payload, const unsigned int length); // `setCallback(MQTT_CALLBACK_SIGNATURE);`を参考に、内部では読むだけのためconstを付与
    void setMessageHandler(const std::string& topic_filter, const MessageCallback& handler);

    void loop();
};
