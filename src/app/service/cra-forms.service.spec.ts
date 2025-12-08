import { TestBed } from '@angular/core/testing';

import { CraFormsService } from './cra-forms.service';

describe('CraFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CraFormsService = TestBed.get(CraFormsService);
    expect(service).toBeTruthy();
  });
});
