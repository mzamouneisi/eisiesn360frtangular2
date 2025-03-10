import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementmodeFormComponent } from './payementmode-form.component';

describe('PayementmodeFormComponent', () => {
  let component: PayementmodeFormComponent;
  let fixture: ComponentFixture<PayementmodeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayementmodeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayementmodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
