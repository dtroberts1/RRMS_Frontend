import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPrevRentalComponent } from './modify-prev-rental.component';

describe('ModifyPrevRentalComponent', () => {
  let component: ModifyPrevRentalComponent;
  let fixture: ComponentFixture<ModifyPrevRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyPrevRentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPrevRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
