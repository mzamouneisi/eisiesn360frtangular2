import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCategoryAppComponent } from './doc-category-app.component';

describe('DocCategoryAppComponent', () => {
  let component: DocCategoryAppComponent;
  let fixture: ComponentFixture<DocCategoryAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocCategoryAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCategoryAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
