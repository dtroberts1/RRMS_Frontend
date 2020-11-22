import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModifyPrevRentalComponent } from './modify-prev-rental.component';

let httpClientSpy: {get: jasmine.Spy};

describe('ModifyPrevRentalComponent', () => {
  let component: ModifyPrevRentalComponent;
  let fixture: ComponentFixture<ModifyPrevRentalComponent>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj(HttpClient, ['get']);
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ModifyPrevRentalComponent ],
      providers:[
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue:{}},
        {provide: MatDialog, useValue: {}},
        {provide: HttpClient, useValue: httpClientSpy},
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
