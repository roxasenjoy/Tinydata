import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLearningTimeComponent } from './total-learning-time.component';

describe('TotalLearningTimeComponent', () => {
  let component: TotalLearningTimeComponent;
  let fixture: ComponentFixture<TotalLearningTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalLearningTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalLearningTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
