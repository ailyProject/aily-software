
export function loadArduinoCode(str) {
  return `#include <Arduino.h>

  const char* ttsString = "${str}";
  
  void setup() {
    // 初始化串口通信
    Serial.begin(115200);
  }
  
  void loop() {
    // 调用生成缓冲区函数
    uint8_t* buffer = genTTSBuffer(ttsString);
    // 发送缓冲区数据
    sendTTSBuffer(buffer);
    // 释放缓冲区内存
    free(buffer);
    // 暂停一段时间
    delay(1000);
  }
  
  void sendTTSBuffer(uint8_t* buffer) {
    // 计算缓冲区的实际长度
    int length = (buffer[1] << 8) | buffer[2];
    for (int i = 0; i < length + 3; i++) {
      Serial.write(buffer[i]);
    }
  }
  
  uint8_t* genTTSBuffer(const char* content) {
    uint8_t buffer_head[] = {0xFD};
    uint8_t buffer_cmd[] = {0x01};
    uint8_t buffer_encode[] = {0x04};
  
    int content_length = strlen(content);
    int buffer_text_length = content_length + 2;
    uint8_t highByte = buffer_text_length >> 8;
    uint8_t lowByte = buffer_text_length & 0xFF;
    uint8_t buffer_length[] = {highByte, lowByte};
  
    uint8_t* buffer = (uint8_t*)malloc(3 + content_length + 3);
    int index = 0;
    buffer[index++] = buffer_head[0];
    buffer[index++] = buffer_length[0];
    buffer[index++] = buffer_length[1];
    buffer[index++] = buffer_cmd[0];
    buffer[index++] = buffer_encode[0];
    for (int i = 0; i < content_length; i++) {
      buffer[index++] = content[i];
    }
    return buffer;
  }`
}

export function loadPythonCode(str) {
  return `import serial
  
  # 串口配置
  ser = serial.Serial('/dev/ttyUSB0', 115200)
  
  ttsString = "${str}"
  
  def genTTSBuffer(content):
      buffer_head = [0xFD]
      buffer_cmd = [0x01]
      buffer_encode = [0x04]
  
      content_bytes = content.encode('utf-8')
      content_length = len(content_bytes)
      buffer_text_length = content_length + 2
      highByte = buffer_text_length >> 8
      lowByte = buffer_text_length & 0xFF
      buffer_length = [highByte, lowByte]
  
      buffer = bytearray(buffer_head + buffer_length + buffer_cmd + buffer_encode + list(content_bytes))
      return buffer
  
  def sendTTSBuffer(buffer):
      ser.write(buffer)
      print('Message written')
  
  # 初始化串口通信
  if ser.is_open:
      print('Serial Port Opened')
      buffer = genTTSBuffer(ttsString)
      sendTTSBuffer(buffer)`
}

export function loadNodejsCode(str) {
  return `const SerialPort = require('serialport');

  const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
  });
  
  const ttsString = "${str}";
  
  // 初始化串口通信
  port.on('open', () => {
    console.log('Serial Port Opened');
    sendTTSBuffer(genTTSBuffer(ttsString));
    setInterval(() => {
      sendTTSBuffer(genTTSBuffer(ttsString));
    }, 1000);
  });
  
  // 生成TTS缓冲区
  genTTSBuffer(content) {
    let buffer_head = new Uint8Array([0xFD]);
    let buffer_cmd = new Uint8Array([0x01]);
    let buffer_encode = new Uint8Array([0x04]);
    let buffer_text = new TextEncoder().encode(content);

    let buffer_text_length = buffer_text.length + 2;
    let highByte = buffer_text_length >> 8;
    let lowByte = buffer_text_length & 0xFF;
    let buffer_length = new Uint8Array([highByte, lowByte]);

    let buffer = Uint8Array.from([...buffer_head, ...buffer_length, ...buffer_cmd, ...buffer_encode, ...buffer_text]);
    return buffer;
  }
  
  // 发送TTS缓冲区
  function sendTTSBuffer(buffer) {
    port.write(buffer, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('Message written');
    });
  }`
}