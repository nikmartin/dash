import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WakeLockService {
  private wakeLock: WakeLockSentinel | null = null;

  constructor() {}

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        console.log('Wake Lock acquired!');
        
        this.wakeLock?.addEventListener('release', () => {
          console.log('Wake Lock released');
        });
      }
    } catch (err) {
      console.error(`${(err as Error).name}, ${(err as Error).message}`);
    }
  }

  async releaseWakeLock() {
    if (this.wakeLock !== null) {
      await this.wakeLock.release();
      this.wakeLock = null;
    }
  }
}
