// ./network/MqttConnection.cpp

#include "network/MqttConnection.h"

// NOTE: PubSubClientのコールバックはCの関数ポインタしか受け付けないため、
static MqttConnection* instance_ = nullptr;
static void staticCallback(char* topic, byte* payload, unsigned int length){
    if (instance_) instance_ ->handleMessage(topic, payload, length);
}

MqttConnection::MqttConnection(std::string protocol, std::string host, uint16_t port, String client_id, INetworkStatus& network_status)
    : protocol_(protocol),
      host_(host),
      port_(port),
      client_id_(client_id),
      network_status_(network_status),
      wifi_client_(),
      mqtt_client_(wifi_client_)
    {
        instance_ = this;
        mqtt_client_.setCallback(staticCallback);
    }

void MqttConnection::handleMessage(char* topic, byte* payload, unsigned int length){
    std::string payload_str(reinterpret_cast<char*>(payload), length);
    if (on_message_)
    {
        on_message_(std::string(topic), payload_str);
    }
}

void MqttConnection::setMessageHandler(std::function<void(const std::string&, const std::string&)> handler){
    on_message_ = handler;
}

bool MqttConnection::ensureConnected() {
    if (!network_status_.isConnected())
    {
        Serial.println("WiFi connection failed.");
        return false;
    }

    if (mqtt_client_.connected())
    {
        return true;
    }

    wifi_client_.stop();
    mqtt_client_.setServer(host_.c_str(), port_);
    if (!mqtt_client_.connect(client_id_.c_str()))
    {
        Serial.printf("MQTT connection failed. Status: %d\n", mqtt_client_.state());
        return false;
    }
    Serial.println("MQTT connected.");
    return true;
}

bool MqttConnection::publish(const std::string& topic, const String& payload) {
    // 接続確認および確立
    if (!ensureConnected())
    {
        return false;
    }

    bool ok = mqtt_client_.publish(topic.c_str(), payload.c_str());
    Serial.printf("MQTT publish result: %s.\n", ok? "success": "failed");
    return ok;
}

bool MqttConnection::subscribe(const std::string& topic){
    if (!ensureConnected())
    {
        return false;
    }
    bool ok = mqtt_client_.subscribe(topic.c_str());
    Serial.printf("MQTT subscribe result: %s.\n", ok ? "success": "failed");
    return ok;
}

void MqttConnection::loop(){
    ensureConnected();
    mqtt_client_.loop();
}
