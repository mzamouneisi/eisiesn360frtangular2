import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantArboComponent } from './consultant-arbo.component';

describe('ConsultantArboComponent', () => {
  let component: ConsultantArboComponent;
  let fixture: ComponentFixture<ConsultantArboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultantArboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantArboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
