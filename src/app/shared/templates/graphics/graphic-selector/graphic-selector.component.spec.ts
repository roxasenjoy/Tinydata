import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicSelectorComponent } from './graphic-selector.component';

describe('GraphicSelectorComponent', () => {
  let component: GraphicSelectorComponent;
  let fixture: ComponentFixture<GraphicSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
