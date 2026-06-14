import { TestBed } from '@angular/core/testing';
import { GpsService } from './gps';
import { provideZonelessChangeDetection } from '@angular/core';

describe('GpsService', () => {
  let service: GpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(GpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
