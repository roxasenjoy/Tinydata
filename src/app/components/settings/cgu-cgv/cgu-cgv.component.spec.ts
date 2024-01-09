import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CguCgvComponent } from './cgu-cgv.component';

describe('CguCgvComponent', () => {
  let component: CguCgvComponent;
  let fixture: ComponentFixture<CguCgvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CguCgvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CguCgvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
