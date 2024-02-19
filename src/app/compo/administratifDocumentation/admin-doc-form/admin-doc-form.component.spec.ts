import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocFormComponent } from './admin-doc-form.component';

describe('AdminDocFormComponent', () => {
  let component: AdminDocFormComponent;
  let fixture: ComponentFixture<AdminDocFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDocFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
