import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsnArboComponent } from './esn-arbo.component';

describe('EsnArboComponent', () => {
  let component: EsnArboComponent;
  let fixture: ComponentFixture<EsnArboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsnArboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsnArboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
