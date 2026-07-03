import { Injectable, signal } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  private speedSignal = signal<number>(0);
  public readonly speed = this.speedSignal.asReadonly();

  private watchId: string | null = null;

  constructor() {}

  async startTracking() {
    if (this.watchId) return;

    this.watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        interval: 1500
      },
      (position, err) => {
        if (err) {
          console.error('Error watching position:', err);
          return;
        }
        if (position && position.coords.speed !== null) {
          // speed is in m/s, convert to km/h
          const speedKmH = position.coords.speed * 3.6;
          this.speedSignal.set(Math.round(speedKmH));
        } else {
          this.speedSignal.set(0);
        }
      }
    );
  }

  async stopTracking() {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }
}
