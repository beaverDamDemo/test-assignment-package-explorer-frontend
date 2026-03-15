import { TestBed } from '@angular/core/testing';

import { Packages } from './packages.service';

describe('Packages', () => {
  let service: Packages;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Packages);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
