import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAccountsComponent } from './open-accounts.component';

describe('OpenAccountsComponent', () => {
  let component: OpenAccountsComponent;
  let fixture: ComponentFixture<OpenAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
