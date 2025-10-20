import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MzDatePickerComponent } from './mz-date-picker.component';

describe('MzDatePickerComponent', () => {
  let component: MzDatePickerComponent;
  let fixture: ComponentFixture<MzDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MzDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MzDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
