import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle],
})
export class SettingsComponent {
  private settingsService = inject(SettingsService);
  public useImperial$ = this.settingsService.useImperial$;

  async toggleImperial(event: any) {
    await this.settingsService.setUseImperial(event.detail.checked);
  }
}
