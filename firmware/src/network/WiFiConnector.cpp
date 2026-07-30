// ./network/WiFiConnector.cpp

#include <WiFi.h>
#include "network/WiFiConnector.h"

void WiFiConnector::connect(const char *ssid, const char *pass) {
    WiFi.mode(WIFI_MODE_STA);
    WiFi.setSleep(false);
    WiFi.begin(ssid, pass);
}

void WiFiConnector::disconnect() {
    WiFi.disconnect(true);
}

bool WiFiConnector::isConnected() const {
    return WiFi.status() == WL_CONNECTED;
}

bool WiFiConnector::waitForConnection(uint32_t timeout_ms) {
    auto start = millis();
    while (!isConnected())
    {
        if (millis() - start > timeout_ms)
        {
            return false;
        }

        delay(500);
    }

    return true;
}
