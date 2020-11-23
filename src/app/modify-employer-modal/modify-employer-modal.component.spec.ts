import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployerService } from '../services/employer.service';
import { ModifyEmployerModalComponent } from './modify-employer-modal.component';

let employerServiceSpy: {saveEmployer: jasmine.Spy, updateEmployer: jasmine.Spy, removeEmployer: jasmine.Spy};

describe('ModifyEmployerModalComponent', () => {
  let component: ModifyEmployerModalComponent;
  let fixture: ComponentFixture<ModifyEmployerModalComponent>;

  beforeEach(async () => {
    employerServiceSpy = jasmine.createSpyObj('EmployerService', ['saveEmployer','updateEmployer','removeEmployer']);
    await TestBed.configureTestingModule({
      declarations: [ ModifyEmployerModalComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: MatDialog, useValue: {}},
        {provide: EmployerService, useValue: employerServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyEmployerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
