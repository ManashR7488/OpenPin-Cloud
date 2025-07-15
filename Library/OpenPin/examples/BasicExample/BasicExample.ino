#include <OpenPin.h>
OpenPin device;

void setup() {
  device.begin("YOUR_SSID", "YOUR_PASSWORD");
  if (device.connect("YOUR_DEVICE_TOKEN")) {
    device.virtualWrite("led", 1);
  }
}

void loop() {
  device.loop();
}
