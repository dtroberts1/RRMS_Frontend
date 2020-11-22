import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddApprovedProspectComponentModal } from './add-approved-prospect.component';

let httpClientSpy: {get: jasmine.Spy};
let routerSpy: {navigate: jasmine.Spy};

describe('AddApprovedProspectComponentModal', () => {
  let component: AddApprovedProspectComponentModal;
  let fixture: ComponentFixture<AddApprovedProspectComponentModal>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj(HttpClient, ['get']);
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ AddApprovedProspectComponentModal ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: MatDialog, useValue: {}},
        {provide: HttpClient, useValue: httpClientSpy},
        {provide: Router, useValue: routerSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApprovedProspectComponentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
