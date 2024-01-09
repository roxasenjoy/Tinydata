import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchBarComponent } from './research-bar.component';

describe('ResearchBarComponent', () => {
  let component: ResearchBarComponent;
  let fixture: ComponentFixture<ResearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
