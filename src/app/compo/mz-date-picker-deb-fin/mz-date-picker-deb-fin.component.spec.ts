import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MzDatePickerDebFinComponent } from './mz-date-picker-deb-fin.component';

describe('MzDatePickerDebFinComponent', () => {
  let component: MzDatePickerDebFinComponent;
  let fixture: ComponentFixture<MzDatePickerDebFinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MzDatePickerDebFinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MzDatePickerDebFinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
