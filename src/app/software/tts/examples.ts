
export function loadArduinoCode(str) {
  return `#include <Arduino.h>

  // Function to concatenate multiple byte arrays
  void concatByteArrays(uint8_t* result, uint8_t** arrays, size_t* lengths, size_t numArrays) {
    size_t offset = 0;
    for (size_t i = 0; i < numArrays; i++) {
      memcpy(result + offset, arrays[i], lengths[i]);
      offset += lengths[i];
    }
  }
  
  // Function to generate TTS buffer
  void genTTSBuffer(const char* content, uint8_t* buffer, size_t* bufferLength) {
    uint8_t buffer_head[] = {0xFD};
    uint8_t buffer_cmd[] = {0x01};
    uint8_t buffer_encode[] = {0x04};
  
    size_t textLength = strlen(content);
    size_t buffer_text_length = textLength + 2;
    uint8_t highByte = buffer_text_length >> 8;
    uint8_t lowByte = buffer_text_length & 0xFF;
    uint8_t buffer_length[] = {highByte, lowByte};
  
    uint8_t* buffer_text = (uint8_t*)content;
  
    size_t lengths[] = {sizeof(buffer_head), sizeof(buffer_length), sizeof(buffer_cmd), sizeof(buffer_encode), textLength};
    uint8_t* arrays[] = {buffer_head, buffer_length, buffer_cmd, buffer_encode, buffer_text};
  
    *bufferLength = sizeof(buffer_head) + sizeof(buffer_length) + sizeof(buffer_cmd) + sizeof(buffer_encode) + textLength;
    concatByteArrays(buffer, arrays, lengths, 5);
  }
  
  void setup() {
    Serial.begin(115200);
    const char* content = "${str}";
    size_t bufferLength;
    uint8_t buffer[256]; // Ensure this is large enough to hold the result
  
    genTTSBuffer(content, buffer, &bufferLength);
  
    Serial.print("Generated buffer: ");
    for (size_t i = 0; i < bufferLength; i++) {
      Serial.write(buffer[i]);
    }
    Serial.println();
  }
  
  void loop() {
    // Nothing to do here
  }`
}

export function loadPythonCode(str) {
  return `python code here`
}

export function loadNodejsCode(str) {
  return `nodejs code here`
}