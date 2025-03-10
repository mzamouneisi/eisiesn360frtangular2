import { TestBed } from '@angular/core/testing';

import { CraConfigurationService } from './cra-configuration.service';

describe('CraConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CraConfigurationService = TestBed.get(CraConfigurationService);
    expect(service).toBeTruthy();
  });
});
