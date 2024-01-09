import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedContentsComponent } from './failed-contents.component';

describe('FailedContentsComponent', () => {
  let component: FailedContentsComponent;
  let fixture: ComponentFixture<FailedContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedContentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
