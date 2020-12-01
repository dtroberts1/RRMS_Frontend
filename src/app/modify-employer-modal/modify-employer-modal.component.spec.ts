import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ExpectedConditions } from 'protractor';
import { EmployerService } from '../services/employer.service';
import { ModifyEmployerModalComponent } from './modify-employer-modal.component';
/*
let employerServiceSpy: {saveEmployer: jasmine.Spy, updateEmployer: jasmine.Spy, removeEmployer: jasmine.Spy};

fdescribe('ModifyEmployerModalComponent', () => {
  let component: ModifyEmployerModalComponent;
  let fixture: ComponentFixture<ModifyEmployerModalComponent>;

  beforeEach(async () => {
    employerServiceSpy = jasmine.createSpyObj('EmployerService', ['saveEmployer','updateEmployer','removeEmployer']);
    await TestBed.configureTestingModule({
      declarations: [ ModifyEmployerModalComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {addMode : false, employers: {}, employerIndex: 0}},
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
  // must be called from within fakeAsync due to use of tick()
  function setInputValue(selector: string, value: string) {
    //tick(1000);
    fixture.detectChanges();

    const myInput = fixture.debugElement.query(By.css(selector)).nativeElement;
    //fixture.detectChanges();
    myInput.value = value;
    //tick(1000);

    myInput.dispatchEvent(new Event('input'));

  }
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('shouldEnableSaveBtn', () => {

  });
  it('shoulc call blur handler', fakeAsync(() => {
        // Important: addMode has to be set to false for this test to work
    // Make modification to a field
    fixture.detectChanges();

    // Confirm that save button becomes visible and enabled. 
    const compElement: HTMLElement = fixture.nativeElement;
    
    // Setup a spy and call changeEditMode(cmpyname), which should enable edit mode of cmpyname
    //const changeEditModeSpy =
    //  jasmine.createSpyObj('ValueService', ['changeEditMode']);
    const editBtn : HTMLButtonElement = compElement.querySelector('[id="modifyEmployerModal_cmpyeditbtn"]');
    //editBtn.click();
    //tick(2000);

    setInputValue('#modifyEmployerModal_cmpyname', 'Roger')
    expect(component.cmpyNameInput.value).toEqual('Roger');

    //const saveBtn = compElement.querySelector('[id="modifyEmpModalSaveEmp"]'); // This works

    fixture.detectChanges();
    const myInputElement = fixture.debugElement.query(By.css('#modifyEmployerModal_cmpyname')).nativeElement;


    //tick(1000);
    myInputElement.dispatchEvent(new Event('blur'));
    expect(component.updateInput).toHaveBeenCalledWith('cmpyname')
    //tick(1000);
    //fixture.detectChanges();
    
  })
});

*/