// ./network/MqttSender.tpp

#include <ArduinoJson.h>
#include "network/MqttSender.h"

template <typename T>
MqttSender<T>::MqttSender(MqttConnection& connection, std::string topic)
    : connection_(connection),
      topic_(topic)
    {}

template <typename T>
bool MqttSender<T>::send(const T& data) {
    JsonDocument doc;
    doc.set(data);
    String json;
    serializeJson(doc, json);

    return connection_.publish(topic_, json);
}
