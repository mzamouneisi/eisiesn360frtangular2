import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgAppComponent } from './msg-app.component';

describe('MsgAppComponent', () => {
  let component: MsgAppComponent;
  let fixture: ComponentFixture<MsgAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
