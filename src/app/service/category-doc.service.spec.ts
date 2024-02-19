import { TestBed } from '@angular/core/testing';

import { CategoryDocService } from './category-doc.service';

describe('CategoryDocService', () => {
  let service: CategoryDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
