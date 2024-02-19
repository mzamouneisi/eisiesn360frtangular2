import { TestBed } from '@angular/core/testing';

import { PayementModeService } from './payement-mode.service';

describe('PayementModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayementModeService = TestBed.get(PayementModeService);
    expect(service).toBeTruthy();
  });
});
