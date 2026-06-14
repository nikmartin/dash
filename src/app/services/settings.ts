import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private useImperialSubject = new BehaviorSubject<boolean>(false);
  public useImperial$: Observable<boolean> = this.useImperialSubject.asObservable();

  private readonly PREF_KEY_USE_IMPERIAL = 'useImperial';

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    const { value } = await Preferences.get({ key: this.PREF_KEY_USE_IMPERIAL });
    if (value !== null) {
      this.useImperialSubject.next(value === 'true');
    }
  }

  async setUseImperial(useImperial: boolean) {
    await Preferences.set({
      key: this.PREF_KEY_USE_IMPERIAL,
      value: useImperial.toString(),
    });
    this.useImperialSubject.next(useImperial);
  }
}
