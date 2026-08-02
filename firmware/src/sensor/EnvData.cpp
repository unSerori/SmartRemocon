// ./sensor/EnvData.cpp

#include "sensor/EnvData.h"

bool convertToJson(const EnvData& src, JsonVariant dst) {
    dst["temperatureSht"] = src.temperature_sht;
    dst["humidity"] = src.humidity;
    dst["temperatureQmp"] = src.temperature_qmp;
    dst["pressure"] = src.pressure;

    return true;
}
