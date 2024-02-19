import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgHistoComponent } from './msg-histo.component';

describe('MsgHistoComponent', () => {
  let component: MsgHistoComponent;
  let fixture: ComponentFixture<MsgHistoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgHistoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgHistoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
