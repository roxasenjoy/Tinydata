import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RappelsMemorielsComponent } from './rappels-memoriels.component';

describe('RappelsMemorielsComponent', () => {
  let component: RappelsMemorielsComponent;
  let fixture: ComponentFixture<RappelsMemorielsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RappelsMemorielsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RappelsMemorielsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
