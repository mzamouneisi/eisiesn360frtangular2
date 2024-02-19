import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRoutingSpecComponent } from './my-routing-spec.component';

describe('MyRoutingSpecComponent', () => {
  let component: MyRoutingSpecComponent;
  let fixture: ComponentFixture<MyRoutingSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRoutingSpecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRoutingSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
