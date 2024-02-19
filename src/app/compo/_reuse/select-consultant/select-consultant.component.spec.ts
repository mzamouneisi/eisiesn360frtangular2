import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConsultantComponent } from './select-consultant.component';

describe('SelectConsultantComponent', () => {
  let component: SelectConsultantComponent;
  let fixture: ComponentFixture<SelectConsultantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectConsultantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
