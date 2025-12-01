import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDepensePeryearDashComponent } from './fee-depense-peryear-dash.component';

describe('FeeDepensePeryearDashComponent', () => {
  let component: FeeDepensePeryearDashComponent;
  let fixture: ComponentFixture<FeeDepensePeryearDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDepensePeryearDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDepensePeryearDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
