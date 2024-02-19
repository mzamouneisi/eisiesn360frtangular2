import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjetFormComponent } from './projet-form.component';

describe('ProjetFormComponent', () => {
  let component: ProjetFormComponent;
  let fixture: ComponentFixture<ProjetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
