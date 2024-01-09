import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidContentsComponent } from './valid-contents.component';

describe('ValidContentsComponent', () => {
  let component: ValidContentsComponent;
  let fixture: ComponentFixture<ValidContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidContentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
