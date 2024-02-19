import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantAppComponent } from './consultant-app.component';

describe('ConsultantAppComponent', () => {
  let component: ConsultantAppComponent;
  let fixture: ComponentFixture<ConsultantAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultantAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
