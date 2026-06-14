import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu labels', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(2); // Dashboard + Settings
    expect(menuItems[0].textContent).toContain('Dashboard');
    expect(menuItems[1].textContent).toContain('Settings');
  });

  it('should have urls', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    // const app = fixture.nativeElement;
    // expect(app.querySelectorAll('ion-item').length).toEqual(2);
    // Ionic applies the rendered href through its own async write queue, so
    // reading the DOM attribute is flaky (FW-6264). Assert the routerLink
    // binding directly, which resolves synchronously.
    const router = TestBed.inject(Router);
    const links = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((el) => el.injector.get(RouterLink));
    expect(links.length).toEqual(2);
    expect(router.serializeUrl(links[0].urlTree!)).toEqual('/dashboard');
    expect(router.serializeUrl(links[1].urlTree!)).toEqual('/settings');
  });
});
