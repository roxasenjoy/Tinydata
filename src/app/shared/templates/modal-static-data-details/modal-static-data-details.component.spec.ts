import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStaticDataDetailsComponent } from './modal-static-data-details.component';

describe('ModalStaticDataDetailsComponent', () => {
  let component: ModalStaticDataDetailsComponent;
  let fixture: ComponentFixture<ModalStaticDataDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalStaticDataDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStaticDataDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
