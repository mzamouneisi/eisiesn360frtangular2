import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementmodeListComponent } from './payementmode-list.component';

describe('PayementmodeListComponent', () => {
  let component: PayementmodeListComponent;
  let fixture: ComponentFixture<PayementmodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayementmodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayementmodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
