import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginMenuComponent } from './user-login-menu.component';

describe('UserLoginMenuComponent', () => {
  let component: UserLoginMenuComponent;
  let fixture: ComponentFixture<UserLoginMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLoginMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
