// OpenPin.cpp
#include "OpenPin.h"
#include <ArduinoJson.h> // For JSON parsing/publishing
#include <HTTPClient.h>

// Constructor
OpenPin::OpenPin() : mqttClient(wifiClient) {}

// Initialize Wi‑Fi and MQTT server
void OpenPin::begin(const char *ssid, const char *pass)
{
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  mqttClient.setClient(wifiClient);
  mqttClient.setServer(this->mqttServer, this->mqttPort);
  mqttClient.setCallback([this](char *topic, byte *payload, unsigned int length)
                         { this->mqttCallback(topic, payload, length); });
}

// Connect using device token, subscribe to cloud-to-device topic
bool OpenPin::connect(const char *token)
{
  this->token = token;
  if (!mqttClient.connected())
  {
    if (!mqttClient.connect(token))
      return false;
  }
  String topic = String("openpin/") + token + "/toDevice";
  mqttClient.subscribe(topic.c_str());
  return true;
}

// Publish virtual pin data to "fromDevice" topic
void OpenPin::virtualWrite(const char *pinName, float value)
{
  if (!mqttClient.connected())
    return;
  StaticJsonDocument<128> doc;
  doc["pin"] = pinName;
  doc["value"] = value;
  char buf[128];
  size_t len = serializeJson(doc, buf);
  String topic = String("openpin/") + token + "/fromDevice";
  mqttClient.publish(topic.c_str(), buf, len);
}

// Register handler for cloud-to-device updates
void OpenPin::virtualRead(const char *pinName, std::function<void(int)> handler)
{
  readCallbacks[String(pinName)] = handler;
}

// Maintain MQTT connection and process messages
void OpenPin::loop()
{
  if (!mqttClient.connected())
    reconnectIfNeeded();
  mqttClient.loop();
}

// Handle incoming MQTT messages, dispatch to matching handlers
void OpenPin::mqttCallback(char *topic, byte *payload, unsigned int length)
{
  StaticJsonDocument<128> doc;
  deserializeJson(doc, payload, length);
  const char *pin = doc["pin"];
  int value = doc["value"];
  auto it = readCallbacks.find(pin);
  if (it != readCallbacks.end())
  {
    it->second(value);
  }
}

// Reconnect logic when MQTT connection is lost
void OpenPin::reconnectIfNeeded()
{
  while (!mqttClient.connected())
  {
    mqttClient.connect(token.c_str());
    delay(1000);
  }
  String topic = String("openpin/") + token + "/toDevice";
  mqttClient.subscribe(topic.c_str());
}

// This function allows publishing raw MQTT messages to any topic
void OpenPin::publishRaw(const char *topic, const char *payload)
{
  mqttClient.publish(topic, payload);
}

// This function allows sending data to a server via HTTP POST
// It takes a server URL and a JSON payload, and returns the server's response
String OpenPin::sendToServer(const char *serverUrl, const char *payload)
{
  OpenPinJson resJson;
  if (WiFi.status() != WL_CONNECTED)
  {
    resJson.add("success", false);
    resJson.add("error", "❌ WiFi not connected");
    return resJson.stringify();
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0)
  {
    String responseBody = http.getString();
    resJson.add("success", true);
    resJson.add("status", httpResponseCode);

    // NOTE: If server returns JSON, append raw
    return resJson.stringify().substring(0, resJson.stringify().length() - 1) +
           ",\"data\":" + responseBody + "}";
  }
  else
  {
    String errorMsg = http.errorToString(httpResponseCode);
    resJson.add("success", false);
    resJson.add("status", httpResponseCode);
    resJson.add("error", errorMsg);
    return resJson.stringify();
  }

  http.end();
}

String OpenPin::request(const char *serverUrl, HttpMethod method, const char *payload)
{
  OpenPinJson resJson;

  if (WiFi.status() != WL_CONNECTED)
  {
    resJson.add("success", false);
    resJson.add("status", -1);
    resJson.add("error", "WiFi not connected");
    return resJson.stringify();
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = -1;

  switch (method)
  {
  case GET:
    httpResponseCode = http.GET();
    break;
  case POST:
    httpResponseCode = http.POST(payload);
    break;
  case PUT:
    httpResponseCode = http.PUT(payload);
    break;
  case DELETE_:
    httpResponseCode = http.sendRequest("DELETE");
    break;
  default:
    // This should never occur, enum enforces it
    resJson.add("success", false);
    resJson.add("status", -2);
    resJson.add("error", "Unsupported HTTP method");
    return resJson.stringify();
  }

  if (httpResponseCode > 0)
  {
    String responseBody = http.getString();
    resJson.add("success", true);
    resJson.add("status", httpResponseCode);
    return resJson.stringify().substring(0, resJson.stringify().length() - 1) +
           ",\"data\":" + responseBody + "}";
  }
  else
  {
    String errorMsg = http.errorToString(httpResponseCode);
    resJson.add("success", false);
    resJson.add("status", httpResponseCode);
    resJson.add("error", errorMsg);
    return resJson.stringify();
  }

  http.end();
}







// OpenPinJson class implementation

OpenPinJson::OpenPinJson()
{
  payload = "{";
}

void OpenPinJson::add(const char *key, const char *value)
{
  if (!isFirst)
    payload += ",";
  payload += "\"" + String(key) + "\":\"" + String(value) + "\"";
  isFirst = false;
}

void OpenPinJson::add(const char *key, const String &value)
{
  if (!isFirst)
    payload += ",";
  payload += "\"" + String(key) + "\":\"" + value + "\"";
  isFirst = false;
}

void OpenPinJson::add(const char *key, int value)
{
  if (!isFirst)
    payload += ",";
  payload += "\"" + String(key) + "\":" + String(value);
  isFirst = false;
}

void OpenPinJson::add(const char *key, float value)
{
  if (!isFirst)
    payload += ",";
  payload += "\"" + String(key) + "\":" + String(value, 2);
  isFirst = false;
}

void OpenPinJson::add(const char *key, double value)
{
  if (!isFirst)
    payload += ",";
  payload += "\"" + String(key) + "\":" + String(value, 2);
  isFirst = false;
}

void OpenPinJson::add(const char *key, bool value)
{
  if (!isFirst)
    payload += ",";
  payload += "\"" + String(key) + "\":" + String(value ? "true" : "false");
  isFirst = false;
}

String OpenPinJson::stringify()
{
  return payload + "}";
}

void OpenPinJson::clear()
{
  payload = "{";
  isFirst = true;
}
