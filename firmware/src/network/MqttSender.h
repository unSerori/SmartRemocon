// ./network/MqttSender.h

#pragma once

#include <string>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include "network/ISender.h"
#include "network/MqttConnection.h"

template <typename T>
class MqttSender: public ISender<T>
{
    // NOTE: TがconvertToJsonを持つことを静的に確定するため
    static_assert(
        std::is_same<
            decltype(convertToJson(std::declval<const T&>(), std::declval<JsonVariant>())),
            bool
        >::value,
        "T must have a `bool convertToJson(const T&, JsonVariant)` function defined for MqttSender to work."
    );

private:
    MqttConnection& connection_; // 参照を持つ
    std::string topic_; // publish先

public:
    MqttSender(MqttConnection& connection, std::string topic);
    ~MqttSender() override = default;

    bool send(const T& data) override;
};

#include "network/MqttSender.tpp"
