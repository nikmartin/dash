import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private useImperialSignal = signal<boolean>(false);
  public readonly useImperial = this.useImperialSignal.asReadonly();

  private readonly PREF_KEY_USE_IMPERIAL = 'useImperial';

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    const { value } = await Preferences.get({ key: this.PREF_KEY_USE_IMPERIAL });
    if (value !== null) {
      this.useImperialSignal.set(value === 'true');
    }
  }

  async setUseImperial(useImperial: boolean) {
    await Preferences.set({
      key: this.PREF_KEY_USE_IMPERIAL,
      value: useImperial.toString(),
    });
    this.useImperialSignal.set(useImperial);
  }
}
