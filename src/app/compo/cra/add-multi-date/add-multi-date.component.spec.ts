import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultiDateComponent } from './add-multi-date.component';

describe('AddMultiDateComponent', () => {
  let component: AddMultiDateComponent;
  let fixture: ComponentFixture<AddMultiDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultiDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultiDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
