import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EsnFormComponent } from './esn-form.component';

describe('EsnFormComponent', () => {
  let component: EsnFormComponent;
  let fixture: ComponentFixture<EsnFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsnFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
