// ./sensor/EnvData.h

#pragma once

#include <ArduinoJson.h>

struct EnvData
{
    float temperature_sht;
    float temperature_qmp;
    float humidity;
    float pressure;
}; 

bool convertToJson(const EnvData& src, JsonVariant dts);
