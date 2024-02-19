import { TestBed } from '@angular/core/testing';

import { NoteFraisService } from './note-frais.service';

describe('NoteFraisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoteFraisService = TestBed.get(NoteFraisService);
    expect(service).toBeTruthy();
  });
});
