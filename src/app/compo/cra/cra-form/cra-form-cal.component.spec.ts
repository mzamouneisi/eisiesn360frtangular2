import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CraFormCalComponent} from './cra-form-cal.component';

describe('CraFormComponent', () => {
  let component: CraFormCalComponent;
  let fixture: ComponentFixture<CraFormCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CraFormCalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraFormCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
