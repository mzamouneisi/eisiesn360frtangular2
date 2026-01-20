import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateEmailComponent } from './valid-email.component';

describe('ValidateEmailComponent', () => {
  let component: ValidateEmailComponent;
  let fixture: ComponentFixture<ValidateEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
