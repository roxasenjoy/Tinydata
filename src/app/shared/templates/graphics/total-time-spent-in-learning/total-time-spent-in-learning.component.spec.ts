import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTimeSpentInLearningComponent } from './total-time-spent-in-learning.component';

describe('TotalTimeSpentInLearningComponent', () => {
  let component: TotalTimeSpentInLearningComponent;
  let fixture: ComponentFixture<TotalTimeSpentInLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalTimeSpentInLearningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalTimeSpentInLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
