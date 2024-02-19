import { TestBed } from '@angular/core/testing';

import { NoteFraisDashboardService } from './note-frais-dashboard.service';

describe('NoteFraisDashboardService', () => {
  let service: NoteFraisDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteFraisDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
