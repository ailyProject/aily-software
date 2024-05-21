import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class SerialService {
  port: any;

  serial = navigator['serial']

  constructor(
  ) { }

  connect() {
    return new Promise(async (resolve, reject) => {
      if ('serial' in navigator) {
        try {
          this.port = await this.serial.requestPort();
          console.log('Serial port:', this.port);
          await this.port.open({ baudRate: 115200, bufferSize: 5120});
          resolve(true)
        } catch (err) {
          console.error('There was an error opening the serial port:', err);
          resolve(false)
        }
      } else {
        console.error('Web Serial API not supported.');
        resolve(false)
      }
    });
  }

  async disconnect() {
    if (this.port) {
      try {
        await this.port.close();
      } catch (err) {
        console.error('There was an error closing the serial port:', err);
      }
    }
  }

  async send(data: string) {
    if (!this.port) {
      console.error('Serial port is not connected.');
      return;
    }
    console.log('send data:', data);

    const dataArrayBuffer = hexStringToUint8Array(data);
    try {
      const writer = this.port.writable.getWriter();
      await writer.write(dataArrayBuffer);
      writer.releaseLock();
      console.log('send buffer:', dataArrayBuffer);
    } catch (err) {
      console.error('There was an error writing data to the serial port:', err);
    }
  }

  genTTSBuffer(content: string) {
    let buffer_head = new Uint8Array([0xFD]);
    let buffer_cmd = new Uint8Array([0x01]);
    let buffer_encode = new Uint8Array([0x04]);
    let buffer_text = new TextEncoder().encode(content);
    let buffer_length = new Uint8Array([0x00, buffer_text.length + 2]);

    let buffer = concatUint8Arrays(buffer_head, buffer_length, buffer_cmd, buffer_encode, buffer_text);
    return buffer;
  }
}

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new Uint8Array(totalLength);
  let length = 0;
  for (const arr of arrays) {
    result.set(arr, length);
    length += arr.length;
  }
  return result;
}

function hexStringToUint8Array(hexString: string): Uint8Array {
  const hexArray = hexString.split(' ');
  const numberArray = hexArray.map(hex => parseInt(hex, 16));
  return new Uint8Array(numberArray);
}
