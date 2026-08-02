// ./network/ISender.h

#pragma once

template <typename T>
class ISender
{
public:
   virtual ~ISender() = default;

   virtual bool send(const T& data) = 0;
};

