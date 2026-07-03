import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideServiceWorker } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideZonelessChangeDetection(),
    provideIonicAngular(),
    provideRouter(routes, withHashLocation(), withPreloading(PreloadAllModules)), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
});
