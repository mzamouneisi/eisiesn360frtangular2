import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAppComponent } from './category-app.component';

describe('CategoryAppComponent', () => {
  let component: CategoryAppComponent;
  let fixture: ComponentFixture<CategoryAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
