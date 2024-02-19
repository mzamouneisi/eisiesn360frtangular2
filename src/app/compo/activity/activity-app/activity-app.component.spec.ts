import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAppComponent } from './activity-app.component';

describe('ActivityAppComponent', () => {
  let component: ActivityAppComponent;
  let fixture: ComponentFixture<ActivityAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityAppComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
