import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocMultipleComponent } from './admin-doc-multiple.component';

describe('AdminDocMultipleComponent', () => {
  let component: AdminDocMultipleComponent;
  let fixture: ComponentFixture<AdminDocMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDocMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
