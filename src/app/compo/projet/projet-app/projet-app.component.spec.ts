import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetAppComponent } from './projet-app.component';

describe('ProjetAppComponent', () => {
  let component: ProjetAppComponent;
  let fixture: ComponentFixture<ProjetAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjetAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjetAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
