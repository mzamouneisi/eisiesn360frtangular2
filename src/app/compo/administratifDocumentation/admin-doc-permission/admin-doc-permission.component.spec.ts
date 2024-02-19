import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocPermissionComponent } from './admin-doc-permission.component';

describe('AdminDocPermissionComponent', () => {
  let component: AdminDocPermissionComponent;
  let fixture: ComponentFixture<AdminDocPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDocPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
