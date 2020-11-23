import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProspectService } from 'src/app/services/prospect.service';
import { AddApprovedProspectComponentModal } from './add-approved-prospect.component';

let routerSpy: {navigate: jasmine.Spy};
let prospectServiceSpy: {updateProspect: jasmine.Spy};

describe('AddApprovedProspectComponentModal', () => {
  let component: AddApprovedProspectComponentModal;
  let fixture: ComponentFixture<AddApprovedProspectComponentModal>;

  beforeEach(async () => {
    prospectServiceSpy = jasmine.createSpyObj(ProspectService, ['updateProspect']);
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ AddApprovedProspectComponentModal ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: MatDialog, useValue: {}},
        {provide: ProspectService, useValue: prospectServiceSpy},
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
