import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTypeAppComponent } from './activityType-app.component';

describe('ActivityTypeAppComponent', () => {
  let component: ActivityTypeAppComponent;
  let fixture: ComponentFixture<ActivityTypeAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityTypeAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTypeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
