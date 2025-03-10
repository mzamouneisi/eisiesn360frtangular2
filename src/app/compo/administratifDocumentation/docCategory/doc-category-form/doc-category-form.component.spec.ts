import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCategoryFormComponent } from './doc-category-form.component';

describe('DocCategoryFormComponent', () => {
  let component: DocCategoryFormComponent;
  let fixture: ComponentFixture<DocCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocCategoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
