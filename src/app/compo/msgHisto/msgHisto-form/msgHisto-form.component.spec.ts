import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MsgHistoFormComponent } from './msgHisto-form.component';

describe('MsgHistoFormComponent', () => {
  let component: MsgHistoFormComponent;
  let fixture: ComponentFixture<MsgHistoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgHistoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgHistoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
