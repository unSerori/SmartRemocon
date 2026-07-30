// ./network/IEnvSender.h

#pragma once

#include "sensor/EnvData.h"

class IEnvSender
{
public:
   virtual ~IEnvSender() = default;

   virtual bool send(const EnvData& data) = 0;
};
