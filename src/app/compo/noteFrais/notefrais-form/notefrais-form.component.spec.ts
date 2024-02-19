import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotefraisFormComponent } from './notefrais-form.component';

describe('NotefraisFormComponent', () => {
  let component: NotefraisFormComponent;
  let fixture: ComponentFixture<NotefraisFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotefraisFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotefraisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
