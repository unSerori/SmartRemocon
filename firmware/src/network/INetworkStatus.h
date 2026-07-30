// ./network/INetworkStatus.h

#pragma once

class INetworkStatus
{
public:
    virtual ~INetworkStatus() = default;

    virtual bool isConnected() const = 0;
};
