import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutComponent } from './shortcut.component';

describe('ShortcutComponent', () => {
  let component: ShortcutComponent;
  let fixture: ComponentFixture<ShortcutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortcutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
