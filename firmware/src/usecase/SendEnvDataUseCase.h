// ./usecase/SendEnvDataUseCase.h

#pragma once
#include "sensor/env/EnvSensor.h"
#include "network/ISender.h"
#include "sensor/env/EnvData.h"

class SendEnvDataUseCase
{
private:
    EnvSensor& sensor_;
    ISender<EnvData>& sender_;
public:
    SendEnvDataUseCase(EnvSensor& sensor, ISender<EnvData>& sender);
    void execute();
};
