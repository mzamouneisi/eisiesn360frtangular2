import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {EsnListComponent} from "../../esn/esn-list/esn-list.component";



describe('EsnListComponent', () => {
  let component: EsnListComponent;
  let fixture: ComponentFixture<EsnListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsnListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
