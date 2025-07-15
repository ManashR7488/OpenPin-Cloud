#include <OpenPin.h>
OpenPin device;

unsigned long lastSend = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Connecting to WiFi...");
  device.begin("iQOO MR2", "ManashR7488");
  Serial.println("Connecting to MQTT...");
  if (device.connect("test_device_01_Token")) {
    Serial.println("Connected to OpenPin MQTT");
  } else {
    Serial.println("Failed to connect to OpenPin MQTT");
  }
}

void loop() {
  device.loop();

  if (millis() - lastSend > 10000) {
    OpenPinJson json;
    json.add("device", "test123");
    json.add("temperature", 28.7);
    json.add("humidity", 59);

    String payload = json.stringify();
    String res = device.request("http://10.199.237.7:5000/api/sensordata", device.GET, payload.c_str());

    Serial.println(payload);
    Serial.println(res);

    lastSend = millis();
  }
}
