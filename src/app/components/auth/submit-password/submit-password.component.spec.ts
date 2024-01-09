import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPasswordComponent } from './submit-password.component';

describe('SubmitPasswordComponent', () => {
  let component: SubmitPasswordComponent;
  let fixture: ComponentFixture<SubmitPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
