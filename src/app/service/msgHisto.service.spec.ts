import { TestBed } from '@angular/core/testing';

import { MsgHistoService } from './msgHisto.service';

describe('MsgHistoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MsgHistoService = TestBed.get(MsgHistoService);
    expect(service).toBeTruthy();
  });
});
