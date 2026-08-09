// ./network/MqttConnection.cpp

#include "network/MqttConnection.h"

// NOTE: PubSubClient::setCallback()は生の関数ポインタのみ受け取る。
// NOTE: そのため、MqttConnection::handleMessageは直接渡せない。
// NOTE: そこでthisを持たせるグローバル変数と、
// NOTE: thisを持たないグローバル関数（static付きなのでスコープはMqttConnection内のみ）を定義し、
// NOTE: このグローバル関数経由でhandleMessageを渡す。
// NOTE: この仕組み事情、MqttConnectionのインスタンスを複数作るとinstance_が上書きされてしまうため、インスタンスは一つを共有される前提。
static MqttConnection* instance_ = nullptr;
static void dispatchToInstance(char* topic, uint8_t* payload, unsigned int length){
    if (instance_)
    {
        instance_->handleMessage(topic, payload, length);
    }
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
        mqtt_client_.setCallback(dispatchToInstance);
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

bool MqttConnection::matchesFilter(const std::string& topic, const std::string& topic_filter){
    // NOTE: 現時点では`+`, `#`といったワイルドカードを使うsubscribeを考慮せず、完全一致のみとしている。
    // NOTE: 必要になった場合はこの関数の中身を拡張し、レベルごとの分割+パターンマッチ処理にする。
    return topic == topic_filter;
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

bool MqttConnection::subscribe(const std::string& topic_filter){
    // 接続確認および確立
    if (!ensureConnected())
    {
        return false;
    }

    bool ok = mqtt_client_.subscribe(topic_filter.c_str());
    Serial.printf("MQTT subscribe result: %s.\n", ok? "success": "failed");
    return ok;
}

void MqttConnection::handleMessage(const char* topic, const uint8_t* payload, const unsigned int length){
    std::string topic_str(topic);
    std::string payload_str(reinterpret_cast<const char*>(payload), length);
    
    for (const auto & entry : handlers_)
    {
        if (matchesFilter(topic_str, entry.topic_filter))
        {
            entry.handler(topic_str, payload_str);
            
        }
        
    }
}

void MqttConnection::setMessageHandler(const std::string& topic_filter, const MessageCallback& handler){
    for (auto &entry : handlers_)
    {
        if (entry.topic_filter == topic_filter) // すでにあるなら上書き
        {
            entry.handler = handler;
            return;
        }
    }

    handlers_.push_back({topic_filter, handler}); // 見つからなかったら新規追加
}

void MqttConnection::loop(){
    ensureConnected();
    mqtt_client_.loop();
}
