import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {CraListComponent} from "../../cra/cra-list/cra-list.component";

describe('CraListComponent', () => {
  let component: CraListComponent;
  let fixture: ComponentFixture<CraListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CraListComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
