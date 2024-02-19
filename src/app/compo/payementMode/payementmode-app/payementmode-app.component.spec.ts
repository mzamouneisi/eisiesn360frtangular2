import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementmodeAppComponent } from './payementmode-app.component';

describe('PayementmodeAppComponent', () => {
  let component: PayementmodeAppComponent;
  let fixture: ComponentFixture<PayementmodeAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayementmodeAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayementmodeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
