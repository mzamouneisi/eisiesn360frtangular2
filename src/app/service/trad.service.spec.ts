import { TestBed } from '@angular/core/testing';

import { TradService } from './trad.service';

describe('TradService', () => {
  let service: TradService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
