import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrevRentalComponent } from './add-prev-rental.component';

describe('AddPrevRentalComponent', () => {
  let component: AddPrevRentalComponent;
  let fixture: ComponentFixture<AddPrevRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrevRentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrevRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
