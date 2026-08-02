// ./usecase/SendEnvDataUseCase.cpp

#include <M5Unified.h>
#include "usecase/SendEnvDataUseCase.h"

SendEnvDataUseCase::SendEnvDataUseCase(EnvSensor& sensor, ISender<EnvData>& sender)
    : sensor_(sensor), sender_(sender) {} // メンバ初期化子リスト

void SendEnvDataUseCase::execute() {
    auto maybeData = sensor_.read();
    if (!maybeData.has_value())
    {
        Serial.println("Failed to read env data.");
        M5.Display.println("Sensor read failed.");
        return;
    }
    const auto& data = maybeData.value();

    Serial.printf(
        "SHT: %.2fC, QMP: %.2fC, Hum: %.1f%%, Pre: %.1fhPa\n",
        data.temperature_sht,
        data.temperature_qmp,
        data.humidity,
        data.pressure
    );
    M5.Display.clear();
    M5.Display.setCursor(0, 0);
    M5.Display.printf(
        "T_SHT: %.1fC, T_QMP: %.1fC, H: %.1f%%, P: %.1fhPa\n",
        data.temperature_sht,
        data.temperature_qmp,
        data.humidity,
        data.pressure
    );

    bool ok = sender_.send(data);
    if (!ok)
    {
        Serial.println("Send failed.");
        M5.Display.println("Send FAILED.");
        return;
    }
    Serial.println("Send Success.");
    M5.Display.println("Send OK");
}