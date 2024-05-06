const int heartRate_pin = A0; 
const int tempPin = A3;     

#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "our_wifi";
const char* password = "password";
const char* server = "api.thingspeak.com";
const String apiKey = "our_api_key";

volatile int tempVal;
volatile int heart_rate = 0; 
volatile int temperature = 0; 
volatile unsigned long lastTempReadTime = 0;

float getTemperature(); // Function declaration
int readHeartRate();

void setup() {
  Serial.begin(115200);
  delay(10);
  delay(10);

  // Connect to WiFi
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentMillis = millis();

  // Read temperature every 10 seconds
  if (currentMillis - lastTempReadTime >= 2000) {
    temperature = getTemperature();
    lastTempReadTime = currentMillis;
  }

  // Read heart rate
  heart_rate = readHeartRate();

  Serial.print("BPM: ");
  Serial.println(heart_rate);
  Serial.print("Temp in Celsius:");
  Serial.println(temperature);

  // Send data to ThingSpeak
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = "/update?api_key=" + apiKey + "&field1=" + String(temperature) + "&field2=" + String(heart_rate);
    Serial.print("Requesting URL: ");
    Serial.println(url);

    http.begin("http://" + String(server) + url);

    int httpCode = http.GET();

    if (httpCode > 0) {
      Serial.printf("[HTTP] GET... code: %d\n", httpCode);
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println(payload);
      }
    } else {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }

  delay(2000); 
}

float getTemperature() {
  tempVal = analogRead(tempPin);
  float mv = (tempVal / 4095.0) * 3300; 
  float cel = mv / 10.0; 
  return cel;
}


int readHeartRate() {
  int sensorValue = analogRead(heartRate_pin);
  int heartRate = map(sensorValue, 0, 1023, 40, 180); 
  return heartRate;
}
