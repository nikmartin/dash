import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  private speedSubject = new BehaviorSubject<number>(0);
  public speed$: Observable<number> = this.speedSubject.asObservable();

  private watchId: string | null = null;

  constructor() {}

  async startTracking() {
    if (this.watchId) return;

    this.watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
      },
      (position, err) => {
        if (err) {
          console.error('Error watching position:', err);
          return;
        }
        if (position && position.coords.speed !== null) {
          // speed is in m/s, convert to km/h
          const speedKmH = position.coords.speed * 3.6;
          this.speedSubject.next(Math.round(speedKmH));
        } else {
          this.speedSubject.next(0);
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
