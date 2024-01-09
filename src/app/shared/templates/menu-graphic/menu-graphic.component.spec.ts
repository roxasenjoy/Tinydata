import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGraphicComponent } from './menu-graphic.component';

describe('MenuGraphicComponent', () => {
  let component: MenuGraphicComponent;
  let fixture: ComponentFixture<MenuGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
