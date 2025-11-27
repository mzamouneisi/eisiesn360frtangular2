import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsD3Component } from './relations-d3.component';

describe('RelationsD3Component', () => {
  let component: RelationsD3Component;
  let fixture: ComponentFixture<RelationsD3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationsD3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
