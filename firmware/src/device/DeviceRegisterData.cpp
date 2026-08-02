// ./device/DeviceRegisterData.cpp

#include "device/DeviceRegisterData.h"

bool convertToJson(const DeviceRegisterData& src, JsonVariant dst) {
    dst["macAddress"] = src.mac_address;
    dst["ipAddress"] = src.ip_address;
    dst["name"] = src.name;

    return true;
}
