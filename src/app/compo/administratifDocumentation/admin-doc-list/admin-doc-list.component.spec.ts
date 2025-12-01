import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocListComponent } from './admin-doc-list.component';

describe('AdminDocListComponent', () => {
  let component: AdminDocListComponent;
  let fixture: ComponentFixture<AdminDocListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDocListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
