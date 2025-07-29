#ifndef OPENPIN_H
#define OPENPIN_H

#include <functional>
#include <map>
#include <WiFi.h>
#include <PubSubClient.h>

class OpenPin {
public:
  OpenPin();

  enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE_
  };


  void begin(const char *ssid, const char *pass);
  bool connect(const char *token);
  void virtualRead(const char *pinName, std::function<void(int)> handler);
  void virtualWrite(const char *pinName, float value);
  void publishRaw(const char *topic, const char *payload);
  String sendToServer(const char *serverUrl, const char *payload);
  String request(const char *serverUrl, HttpMethod method, const char *payload);
  void loop();

private:
  WiFiClient wifiClient;
  PubSubClient mqttClient;
  String token;
  std::map<String, std::function<void(int)>> readCallbacks;

  void mqttCallback(char *topic, byte *payload, unsigned int length);
  void reconnectIfNeeded();

  const char *mqttServer = "broker.emqx.io";
  const uint16_t mqttPort = 1883;
};

#endif  // OPENPIN_H

class OpenPinJson {
private:
  String payload;
  bool isFirst = true;

public:
  OpenPinJson();
  void add(const char *key, const char *value);
  void add(const char *key, const String &value);
  void add(const char *key, int value);
  void add(const char *key, float value);
  void add(const char *key, double value);
  void add(const char *key, bool value);

  String stringify();
  void clear();
};

