import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import { settingsOutline, settingsSharp, speedometerOutline, speedometerSharp } from 'ionicons/icons';
import { WakeLockService } from './services/wakelock.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, RouterLink, RouterLinkActive],
})
export class AppComponent implements OnInit {
  private wakeLockService = inject(WakeLockService);
  private platform = inject(Platform);

  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'speedometer' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];

  constructor() {
    addIcons({ settingsOutline, settingsSharp, speedometerOutline, speedometerSharp });
  }

  async ngOnInit() {
    await this.platform.ready();
    this.wakeLockService.requestWakeLock();
  }
}

