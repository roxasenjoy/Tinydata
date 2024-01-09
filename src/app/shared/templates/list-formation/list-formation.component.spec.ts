import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormationComponent } from './list-formation.component';

describe('ListFormationComponent', () => {
  let component: ListFormationComponent;
  let fixture: ComponentFixture<ListFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFormationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
