import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotefraisDashboardComponent } from './notefrais-dashboard.component';

describe('NotefraisDashboardComponent', () => {
  let component: NotefraisDashboardComponent;
  let fixture: ComponentFixture<NotefraisDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotefraisDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotefraisDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
