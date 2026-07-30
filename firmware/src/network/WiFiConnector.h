// ./network/WiFiConnector.h

#pragma once

#include <cstdint>
#include "network/INetworkStatus.h"

class WiFiConnector: public INetworkStatus
{
public:
    void connect(const char *ssid, const char *pass = nullptr); // 接続（非同期）
    void disconnect(); // 切断
    bool isConnected() const override; // 接続状態の確認
    bool waitForConnection(uint32_t timeout_ms = 10000); // 接続を待つ
    // 将来的に「disconnectでリセットし、connectionで接続開始、waitForConnectionで待機する」をユースケース側に追加
};
