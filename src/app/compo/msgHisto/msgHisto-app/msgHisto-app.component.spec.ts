import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgHistoAppComponent } from './msgHisto-app.component';

describe('MsgHistoAppComponent', () => {
  let component: MsgHistoAppComponent;
  let fixture: ComponentFixture<MsgHistoAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgHistoAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgHistoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
