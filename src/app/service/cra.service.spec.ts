import { TestBed } from '@angular/core/testing';

import { CraService } from './cra.service';

describe('CraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CraService = TestBed.get(CraService);
    expect(service).toBeTruthy();
  });
});
