import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCategoryListComponent } from './doc-category-list.component';

describe('DocCategoryListComponent', () => {
  let component: DocCategoryListComponent;
  let fixture: ComponentFixture<DocCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
