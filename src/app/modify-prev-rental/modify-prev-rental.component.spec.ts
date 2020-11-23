import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PreviousRental } from '../services/prevrental.service';
import { ModifyPrevRentalComponent } from './modify-prev-rental.component';

let prevRentalServiceSpy: {savePrevRental: jasmine.Spy, updatePrevRental: jasmine.Spy, removePrevRental: jasmine.Spy};

describe('ModifyPrevRentalComponent', () => {
  let component: ModifyPrevRentalComponent;
  let fixture: ComponentFixture<ModifyPrevRentalComponent>;

  beforeEach(async () => {
    prevRentalServiceSpy = jasmine.createSpyObj('PreviousRental', ['savePrevRental', 'updatePrevRental', 'removePrevRental']);
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ModifyPrevRentalComponent ],
      providers:[
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue:{}},
        {provide: MatDialog, useValue: {}},
        {provide: PreviousRental, useValue: prevRentalServiceSpy},
      ]
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
