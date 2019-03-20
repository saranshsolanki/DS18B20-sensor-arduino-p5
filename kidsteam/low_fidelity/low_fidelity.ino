#include <LiquidCrystal.h>
#include <DallasTemperature.h>
#include <OneWire.h>

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
int temp_sensor_1 = 6;

float temperature = 0;
float fahrenheit = 0;

OneWire oneWirePin_1 (temp_sensor_1);
DallasTemperature sensors(&oneWirePin_1);

int x = 150;
int y = 5000;


void setup() {
  Serial.begin(9600);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  temperature = sensors.getTempCByIndex(0);
  
  union {
    float value;
    unsigned char bytes[4];
  } byte_Temp;

  byte_Temp.value = temperature;

  int temp = (int)(temperature);
  fahrenheit = sensors.toFahrenheit(temperature);
  
//  Serial.print(temperature);
  Serial.write(byte_Temp.bytes,4);
//  delay(3000); 
}
