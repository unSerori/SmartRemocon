// ./device/DeviceRegisterData.h

#pragma once

#include <ArduinoJson.h>
#include <string>

struct DeviceRegisterData
{
    std::string mac_address;
    std::string ip_address;
    std::string name;
}; 

bool convertToJson(const DeviceRegisterData& src, JsonVariant dts);
