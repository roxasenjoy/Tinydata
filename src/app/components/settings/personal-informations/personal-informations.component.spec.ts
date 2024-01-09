import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationsComponent } from './personal-informations.component';

describe('PersonalInformationsComponent', () => {
  let component: PersonalInformationsComponent;
  let fixture: ComponentFixture<PersonalInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalInformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
