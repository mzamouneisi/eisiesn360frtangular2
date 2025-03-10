import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocAppComponent } from './admin-doc-app.component';

describe('AdminDocAppComponent', () => {
  let component: AdminDocAppComponent;
  let fixture: ComponentFixture<AdminDocAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDocAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
