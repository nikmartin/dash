import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { GpsService } from '../../services/gps';
import { Obd2Service } from '../../services/obd2';
import { SettingsService } from '../../services/settings';
import { addIcons } from 'ionicons';
import { bluetoothOutline, bluetoothSharp } from 'ionicons/icons';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { GaugeComponent } from '../gauge/gauge.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, GaugeComponent],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private gpsService = inject(GpsService);
  private obd2Service = inject(Obd2Service);
  private settingsService = inject(SettingsService);

  public speed = this.gpsService.speed;
  public obdData = this.obd2Service.data;
  public isConnected = this.obd2Service.connected;
  public useImperial = this.settingsService.useImperial;
  public devices: ScanResult[] = [];
  public showDeviceList = false;

  constructor() {
    addIcons({ bluetoothOutline, bluetoothSharp });
  }

  ngOnInit() {
    this.gpsService.startTracking();
  }

  ngOnDestroy() {
    this.gpsService.stopTracking();
    this.obd2Service.disconnect();
  }

  async scan() {
    this.devices = await this.obd2Service.listDevices();
    this.showDeviceList = true;
  }

  // Add a getter or a signal transform
  get displaySpeed(): number {
    const rawSpeed = this.useImperial() ? (this.speed() * 0.621371) : this.speed();
    return Math.round(rawSpeed * 10) / 10; // Round to 1 decimal
  }

  async connect(deviceId: string) {
    try {
      await this.obd2Service.connect(deviceId);
      this.showDeviceList = false;
    } catch (err) {
      alert('Connection failed: ' + err);
    }
  }

  async disconnect() {
    await this.obd2Service.disconnect();
  }
}

