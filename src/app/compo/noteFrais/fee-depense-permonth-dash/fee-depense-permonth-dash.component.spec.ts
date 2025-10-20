import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDepensePermonthDashComponent } from './fee-depense-permonth-dash.component';

describe('FeeDepensePermonthDashComponent', () => {
  let component: FeeDepensePermonthDashComponent;
  let fixture: ComponentFixture<FeeDepensePermonthDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDepensePermonthDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDepensePermonthDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
