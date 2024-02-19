import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDepensePerconsultantDashComponent } from './fee-depense-perconsultant-dash.component';

describe('FeeDepensePerconsultantDashComponent', () => {
  let component: FeeDepensePerconsultantDashComponent;
  let fixture: ComponentFixture<FeeDepensePerconsultantDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDepensePerconsultantDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDepensePerconsultantDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
