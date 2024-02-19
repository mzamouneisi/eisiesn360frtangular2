import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotefraisAppComponent } from './notefrais-app.component';

describe('NotefraisAppComponent', () => {
  let component: NotefraisAppComponent;
  let fixture: ComponentFixture<NotefraisAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotefraisAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotefraisAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
