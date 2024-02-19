import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsnAppComponent } from './esn-app.component';

describe('EsnAppComponent', () => {
  let component: EsnAppComponent;
  let fixture: ComponentFixture<EsnAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsnAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsnAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
