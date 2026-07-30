// ./usecase/SendEnvDataUseCase.h

#pragma once
#include "sensor/EnvSensor.h"
#include "network/IEnvSender.h"

class SendEnvDataUseCase
{
private:
    EnvSensor& sensor_;
    IEnvSender& sender_;
public:
    SendEnvDataUseCase(EnvSensor& sensor, IEnvSender& sender);
    void execute();
};
