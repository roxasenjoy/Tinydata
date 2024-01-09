import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentsValidComponent } from './contents-valid.component';

describe('PerformanceComponent', () => {
  let component: ContentsValidComponent;
  let fixture: ComponentFixture<ContentsValidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentsValidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentsValidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
