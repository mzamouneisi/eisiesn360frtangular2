import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CraAppComponent } from './cra-app.component';

describe('CraAppComponent', () => {
  let component: CraAppComponent;
  let fixture: ComponentFixture<CraAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CraAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
