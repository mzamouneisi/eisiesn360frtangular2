import { TestBed } from '@angular/core/testing';

import { ActivityTypeService } from './activityType.service';

describe('ActivityTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityTypeService = TestBed.get(ActivityTypeService);
    expect(service).toBeTruthy();
  });
});
