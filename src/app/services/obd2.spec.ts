import { TestBed } from '@angular/core/testing';

import { Obd2Service } from './obd2';

describe('Obd2Service', () => {
  let service: Obd2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Obd2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
