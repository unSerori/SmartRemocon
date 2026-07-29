#include <M5Unified.h>

void setup() {
  Serial.begin(115200);

  auto cfg = M5.config();
  M5.begin(cfg);
}

void loop() {
  M5.update();

  if (M5.BtnC.wasPressed())
  {
    auto msg = "Pressed Btn C.";
    Serial.println(msg);
    M5.Display.clear();
    M5.Display.setTextSize(2);
    M5.Display.setTextColor(WHITE); // 第二引数には背景色も入れれる（デフォは等価）
    M5.Display.setCursor(0, 0);
    M5.Display.println(msg);
  }
}
