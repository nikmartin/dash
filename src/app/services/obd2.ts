import { Injectable, signal } from '@angular/core';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
export interface ObdData {
  rpm: number;
  waterTemp: number;
  voltage: number;
  oilPressure: number;
}

// Common ELM327 BLE Service and Characteristic UUIDs
const ELM327_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const ELM327_CHARACTERISTIC_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';

@Injectable({
  providedIn: 'root',
})
export class Obd2Service {
  private dataSignal = signal<ObdData>({
    rpm: 0,
    waterTemp: 0,
    voltage: 0,
    oilPressure: 0,
  });
  public readonly data = this.dataSignal.asReadonly();

  private connectedSignal = signal<boolean>(false);
  public readonly connected = this.connectedSignal.asReadonly();
  private deviceId: string | null = null;
  private isPolling = false;

  constructor() {}

  async connect(deviceId: string): Promise<void> {
    try {
      await BleClient.initialize();
      await BleClient.connect(deviceId, (id) => this.onDisconnect(id));
      this.deviceId = deviceId;
      this.connectedSignal.set(true);
      await this.initializeObd();
      this.startPolling();
    } catch (err) {
      console.error('Connection failed', err);
      this.connectedSignal.set(false);
      this.deviceId = null;
      throw err;
    }
  }

  private onDisconnect(deviceId: string) {
    console.log(`Device ${deviceId} disconnected`);
    this.deviceId = null;
    this.connectedSignal.set(false);
    this.stopPolling();
  }

  async disconnect(): Promise<void> {
    this.stopPolling();
    if (this.deviceId) {
      await BleClient.disconnect(this.deviceId);
      this.deviceId = null;
    }
    this.connectedSignal.set(false);
  }

  private async initializeObd() {
    await this.sendCommand('AT Z');
    await this.sendCommand('AT E0');
    await this.sendCommand('AT L0');
    await this.sendCommand('AT SP 0');
  }

  private async startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;
    while (this.isPolling && this.deviceId) {
      await this.pollData();
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between polls
    }
  }

  private stopPolling() {
    this.isPolling = false;
  }

  private async pollData() {
    if (!this.deviceId) return;
    try {
      const rpm = await this.getRpm();
      const waterTemp = await this.getWaterTemp();
      const voltage = await this.getVoltage();
      const oilPressure = await this.getOilPressure();

      this.dataSignal.set({
        rpm,
        waterTemp,
        voltage,
        oilPressure,
      });
    } catch (err) {
      console.error('Error polling OBD data', err);
    }
  }

  private async sendCommand(command: string): Promise<string> {
    if (!this.deviceId) return '';
    const encoded = new TextEncoder().encode(command + '\r');
    const data = new DataView(encoded.buffer);
    await BleClient.write(this.deviceId, ELM327_SERVICE_UUID, ELM327_CHARACTERISTIC_UUID, data);

    // We expect a response ending with '>'
    let response = '';
    while (!response.includes('>')) {
      const result = await BleClient.read(this.deviceId, ELM327_SERVICE_UUID, ELM327_CHARACTERISTIC_UUID);
      response += new TextDecoder().decode(result);
    }
    return response;
  }

  private async getRpm(): Promise<number> {
    const resp = await this.sendCommand('01 0C');
    const hex = this.extractHex(resp, '41 0C');
    if (hex && hex.length >= 4) {
      const aa = parseInt(hex.substring(0, 2), 16);
      const bb = parseInt(hex.substring(2, 4), 16);
      return Math.round(((aa * 256) + bb) / 4);
    }
    return 0;
  }

  private async getWaterTemp(): Promise<number> {
    const resp = await this.sendCommand('01 05');
    const hex = this.extractHex(resp, '41 05');
    if (hex && hex.length >= 2) {
      const aa = parseInt(hex.substring(0, 2), 16);
      return aa - 40;
    }
    return 0;
  }

  private async getVoltage(): Promise<number> {
    const resp = await this.sendCommand('AT RV');
    const match = resp.match(/(\d+\.\d+)V/);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
  }

  private async getOilPressure(): Promise<number> {
    try {
      const resp = await this.sendCommand('01 52');
      const hex = this.extractHex(resp, '41 52');
      if (hex && hex.length >= 4) {
        const aa = parseInt(hex.substring(0, 2), 16);
        const bb = parseInt(hex.substring(2, 4), 16);
        return (aa * 256 + bb) * 10 / 6.895;
      }
    } catch (e) {}
    return 0;
  }

  private extractHex(resp: string, prefix: string): string | null {
    const cleanResp = resp.replace(/\s/g, '');
    const cleanPrefix = prefix.replace(/\s/g, '');
    const index = cleanResp.indexOf(cleanPrefix);
    if (index !== -1) {
      return cleanResp.substring(index + cleanPrefix.length);
    }
    return null;
  }

  async listDevices(): Promise<ScanResult[]> {
    await BleClient.initialize();
    const devices: ScanResult[] = [];
    await BleClient.requestLEScan(
      { services: [ELM327_SERVICE_UUID] },
      (result) => {
        devices.push(result);
      }
    );
    await new Promise(resolve => setTimeout(resolve, 5000));
    await BleClient.stopLEScan();
    return devices;
  }
}

