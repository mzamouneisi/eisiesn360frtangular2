import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddMultipleActivityComponent } from "./add-multiple-activity.component";

describe("AddMultipleActivityComponent", () => {
  let component: AddMultipleActivityComponent;
  let fixture: ComponentFixture<AddMultipleActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddMultipleActivityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultipleActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
