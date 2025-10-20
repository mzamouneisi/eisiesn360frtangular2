import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidEmailComponent } from './valid-email.component';

describe('ValidEmailComponent', () => {
  let component: ValidEmailComponent;
  let fixture: ComponentFixture<ValidEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
