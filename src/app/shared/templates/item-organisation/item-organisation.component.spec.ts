import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOrganisationComponent } from './item-organisation.component';

describe('ItemOrganisationComponent', () => {
  let component: ItemOrganisationComponent;
  let fixture: ComponentFixture<ItemOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemOrganisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
