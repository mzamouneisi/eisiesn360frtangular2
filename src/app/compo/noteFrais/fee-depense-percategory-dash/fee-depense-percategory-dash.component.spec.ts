import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDepensePercategoryDashComponent } from './fee-depense-percategory-dash.component';

describe('FeeDepensePercategoryDashComponent', () => {
  let component: FeeDepensePercategoryDashComponent;
  let fixture: ComponentFixture<FeeDepensePercategoryDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDepensePercategoryDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDepensePercategoryDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
