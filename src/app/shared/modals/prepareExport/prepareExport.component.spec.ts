import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareExportComponent } from './prepareExport.component';

describe('PrepareExportComponent', () => {
  let component: PrepareExportComponent;
  let fixture: ComponentFixture<PrepareExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
