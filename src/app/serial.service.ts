import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SerialService {
  private port: any;

  constructor() { }

  async connect() {
    if ('serial' in navigator) {
      try {
        this.port = await (navigator as any).serial.requestPort();
        await this.port.open({ baudRate: 9600 });
      } catch (err) {
        console.error('There was an error opening the serial port:', err);
      }
    } else {
      console.error('Web Serial API not supported.');
    }
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

    const encoder = new TextEncoder();
    const dataArrayBuffer = encoder.encode(data);
    try {
      await this.port.write(dataArrayBuffer);
    } catch (err) {
      console.error('There was an error writing data to the serial port:', err);
    }
  }
}
