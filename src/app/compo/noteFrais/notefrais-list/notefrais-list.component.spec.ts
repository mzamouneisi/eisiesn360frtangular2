import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotefraisListComponent } from './notefrais-list.component';

describe('NotefraisListComponent', () => {
  let component: NotefraisListComponent;
  let fixture: ComponentFixture<NotefraisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotefraisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotefraisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
