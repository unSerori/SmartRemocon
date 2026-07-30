// ./sensor/EnvSensor.h

#pragma once
#include <optional>
#include <M5UnitENV.h>
#include "EnvData.h"

class EnvSensor
{
private:
  SHT3X sht3x_;
  QMP6988 qmp_;
public:
  bool begin();
  std::optional<EnvData> read();
};
