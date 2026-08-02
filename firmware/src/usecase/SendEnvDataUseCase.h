// ./usecase/SendEnvDataUseCase.h

#pragma once
#include "sensor/EnvSensor.h"
#include "network/ISender.h"
#include "sensor/EnvData.h"

class SendEnvDataUseCase
{
private:
    EnvSensor& sensor_;
    ISender<EnvData>& sender_;
public:
    SendEnvDataUseCase(EnvSensor& sensor, ISender<EnvData>& sender);
    void execute();
};
