import { TestBed } from '@angular/core/testing';

import { EsnService } from './esn.service';

describe('EsnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EsnService = TestBed.get(EsnService);
    expect(service).toBeTruthy();
  });
});
