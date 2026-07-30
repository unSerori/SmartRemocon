// ./sensor/EnvSensor.cpp

#include <optional> 
#include "sensor/EnvData.h"
#include "sensor/EnvSensor.h"

bool EnvSensor::begin()
{
  bool qmpOK = qmp_.begin(&Wire, QMP6988_SLAVE_ADDRESS_L, 21, 22, 400000U);
  if (!qmpOK)
  {
    Serial.println("Couldn't find QMP6988");
  }
  bool shtOk = sht3x_.begin(&Wire, SHT3X_I2C_ADDR, 21, 22, 400000U);
  if (!shtOk)
  {
    Serial.println("Couldn't find SHT3X");
  }

  return qmpOK && shtOk;
}

std::optional<EnvData> EnvSensor::read()
{
  if (!qmp_.update() || !sht3x_.update())
  {
    return std::nullopt;
  }

  EnvData data;
  data.temperature_sht = sht3x_.cTemp;
  data.temperature_qmp = qmp_.cTemp;
  data.humidity = sht3x_.humidity;
  data.pressure = qmp_.pressure;

  return data;
}
