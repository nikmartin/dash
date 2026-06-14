import { TestBed } from '@angular/core/testing';
import { Obd2Service } from './obd2';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Obd2Service', () => {
  let service: Obd2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(Obd2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
