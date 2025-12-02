import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDepenseInfoDashComponent } from './fee-depense-info-dash.component';

describe('FeeDepenseInfoDashComponent', () => {
  let component: FeeDepenseInfoDashComponent;
  let fixture: ComponentFixture<FeeDepenseInfoDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDepenseInfoDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDepenseInfoDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
