import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CraConfigurationComponent } from './cra-configuration.component';

describe('CraConfigurationComponent', () => {
  let component: CraConfigurationComponent;
  let fixture: ComponentFixture<CraConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CraConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
