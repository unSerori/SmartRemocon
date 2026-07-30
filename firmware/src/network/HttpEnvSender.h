// ./network/HttpEnvSender.h

# pragma once

#include <string>
#include "network/IEnvSender.h"
#include "network/INetworkStatus.h"


class HttpEnvSender : public IEnvSender
{
private:
    std::string protocol_; // http or https
    std::string host_; // ホスト先
    uint16_t port_;// ポート
    std::string path_;// パス
    INetworkStatus& network_status_; // 接続確認
public:
    HttpEnvSender(std::string protocol, std::string host, uint16_t port, std::string path, INetworkStatus& network_status); // メンバ変数の初期化
    ~HttpEnvSender() override = default;

    bool send(const EnvData& data) override;
};
