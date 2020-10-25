import { Component, Inject, OnInit, Type } from '@angular/core';
import { AbstractControl, FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
import {IEmployer, SalaryType} from '../interfaces/Employer';
import {EmployerService} from '../services/employer.service';

interface ICurrentEmp{
  name: string;
  current: boolean;
};
interface ISalaryType{
  name: string,
  salaryType: SalaryType,
}
export enum TermType {
  monthToMonth = 1,
  fixedTerm = 2,
}
@Component({
  selector: 'app-modify-employer-modal',
  templateUrl: './modify-employer-modal.component.html',
  styleUrls: ['./modify-employer-modal.component.css']
})
export class ModifyEmployerModalComponent implements OnInit{
  addMode: boolean;
  currItem:string;
  salItem: string;
  homeImagePath : string;
  origSettings : IEmployer;
  editCmpyName: boolean = false;
  editFName: boolean = false;
  editLName: boolean = false;
  editMdInit: boolean = false;
  editEmail: boolean = false;
  editPhone: boolean = false;
  editAddressStreet1: boolean = false;
  editAddressStreet2: boolean = false;
  editCity: boolean = false;
  editState: boolean = false;
  editZipcode: boolean = false;
  editJobTitle: boolean = false;
  editStartDate: boolean = false;
  editEndDate: boolean = false;
  fieldsModified: boolean = false;
  currentEmployerIndex: number;
  employerCount: number = 0;
  employer: IEmployer;
  employers: Iterable<IEmployer>;
  selectedRoomId : number;
  cmpyNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[.@&]?[a-zA-Z0-9 ]+[ !.@&()]?[ a-zA-Z0-9!()]+/)]);
  fNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  lNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  emailInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  mdInitInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  phoneInput = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  addressStreet1Input = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2Input  = new FormControl('', [Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  cityInput = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  stateInput  = new FormControl('',[Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  zipcodeInput = new FormControl('',  [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  jobTitleInput = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,30}')]);
  startDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  endDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : TermType = TermType.monthToMonth;
  currentList:Iterable<ICurrentEmp> = [
    { "name": "No", current: false},
    { "name": "Yes", current: true}
]
  salList:Iterable<ISalaryType> = [
    {"name": "Hourly", salaryType: SalaryType.hourly},
    {"name": "Annual", salaryType: SalaryType.annual},
  ]
currentMap = new Map<string, boolean>([
  ['No', false],
  ['Yes', true]
]);
  salMap = new Map<string, SalaryType>([
    ["Hourly", SalaryType.hourly],
    ["Annual", SalaryType.annual],
  ])

  salaryType: string[] = ['Annual', 'Hourly'];
  salType : SalaryType = SalaryType.annual; // Possibly need to assign this to number instead of SalaryType

  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
  selectedRoomName : string = 'No Room Selected';
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  public dialogRef: MatDialogRef<ModifyEmployerModalComponent>,
  public dialog: MatDialog,
  private employerService: EmployerService, 
  ) {

  }
  ngOnInit(): void {
    if (this.data.addMode == true)
      this.addMode = true;
      else if (this.data.addMode == false){
        this.addMode = false;
        this.employers = this.data.employers; 
        if (this.employers != null)
        {  
            this.currentEmployerIndex = this.data.employerIndex;
            this.setOrigSettings(this.data.employers[this.currentEmployerIndex]);
            this.getSettings();
            this.employerCount = (<any[]>this.data.employers).length;
        }
      }

    console.log("addMode is ***" + this.addMode);
    }
  setOrigSettings(employer : IEmployer)
  {
   this.origSettings = Object.assign({}, employer);
   console.log("in set OrigSettings, settings are " + JSON.stringify(this.origSettings ));
  }

  canDispNextAndPrev(){
    if (this.employerCount > 1)
      return true;
    return false;
  }
  changeEditMode(str:string){
    switch(str) { 
      case 'cmpyname': { 
        this.editCmpyName = !this.editCmpyName;
         break; 
      } 
      case 'fname': { 
        this.editFName = !this.editFName;
         break; 
      } 
      case 'lname': { 
        this.editLName = !this.editLName;
         break; 
      } 
      case 'email': { 
        this.editEmail = !this.editEmail;
      } 
      break; 
      case 'phone': { 
        this.editPhone = !this.editPhone;
      } 
      break; 
      case 'stadd1': { 
        this.editAddressStreet1 = !this.editAddressStreet1;
      } 
      break; 
      case 'stadd2': { 
        this.editAddressStreet2 = !this.editAddressStreet2;
      } 
      break; 
      case 'city': { 
        this.editCity = !this.editCity;
      }
      break;  
      case 'state': { 
        this.editState = !this.editState;
      }
      break;
      case 'zipcode': { 
        this.editZipcode = !this.editZipcode;
      }
      break;  
      case 'jobtitle': { 
        this.editJobTitle = !this.editJobTitle;
      }
      break; 
      case 'start': { 
        this.editStartDate = !this.editStartDate;
      }
      break; 
      case 'end': { 
        this.editEndDate = !this.editEndDate;
      }
      break; 
      default: { 
         //statements; 
         break; 
      } 
   } 
  }
  updateInput(editStr : string){
    if (this.addMode == false){
      console.log("bluring");
      switch(editStr) { 
        case 'cmpyname': { 
          if (this.cmpyNameInput.valid == true)
          {
            console.log("is valid");
            this.employer.CompanyName = this.cmpyNameInput.value;
            
          }
          else{
            console.log("is not valid");
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'fname': { 
          if (this.fNameInput.valid == true)
          {
            console.log("is valid");
            this.employer.MgrFName = this.fNameInput.value;
            
          }
          else{
            console.log("is not valid");
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'lname': { 
          if (this.lNameInput.valid == true)
          {
            console.log("is valid");
            this.employer.MgrLName = this.lNameInput.value;
            
          }
          else{
            console.log("is not valid");
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'email': { 
          if (this.emailInput.valid == true)
          {
            this.employer.MgrEmailAddress = this.emailInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'phone': { 
          if (this.phoneInput.valid == true)
          {
            this.employer.MgrPhoneNumber = this.phoneInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break;    
        case 'stadd1': { 
          if (this.addressStreet1Input.valid == true)
          {
            this.employer.AddressStreet1 = this.addressStreet1Input.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'stadd2': { 
          if (this.addressStreet2Input.valid == true)
          {
            this.employer.AddressStreet2 = this.addressStreet2Input.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'city': { 
          if (this.cityInput.valid == true)
          {
            this.employer.AddressCity = this.cityInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'state': { 
          if (this.stateInput.valid == true)
          {
            this.employer.AddressState = this.stateInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'zipcode': { 
          if (this.zipcodeInput.valid == true)
          {
            this.employer.AddressZipCode = this.zipcodeInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'jobtitle': { 
          if (this.jobTitleInput.valid == true)
          {
            this.employer.ProspectJobTitle = this.jobTitleInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'start': { 
          if (this.startDateInput.valid == true)
          {
            this.employer.StartDate = this.startDateInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'end': { 
          if (this.endDateInput.valid == true)
          {
            this.employer.EndDate = this.endDateInput.value;
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
      }
      this.changeEditMode(editStr);
      this.fieldsModified = true;
    }
  }

  getSettings(){
    console.log("in getsett, empindex is " + this.currentEmployerIndex);
    this.employer = this.data.employers[this.currentEmployerIndex];

    this.cmpyNameInput.setValue(this.employer.CompanyName);
    this.fNameInput.setValue(this.employer.MgrFName);
    this.fNameInput.setValue(this.employer.MgrLName);
    this.emailInput.setValue(this.employer.MgrEmailAddress);
    this.phoneInput.setValue(this.employer.MgrPhoneNumber);
    this.addressStreet1Input.setValue(this.employer.AddressStreet1);
    this.addressStreet2Input.setValue(this.employer.AddressStreet2);
    this.cityInput.setValue(this.employer.AddressCity);
    this.stateInput.setValue(this.employer.AddressState);
    this.zipcodeInput.setValue(this.employer.AddressZipCode);
    this.jobTitleInput.setValue(this.employer.ProspectJobTitle);
    this.startDateInput.setValue(this.employer.StartDate);
    this.endDateInput.setValue(this.employer.EndDate);
    this.setCurrentEmp(); // Radio button for if employer is current
    this.setSalType(); // Radio button for salary item for employer
  }

  setCurrentEmp(){
    console.log("this.employer.current: " + this.employer.Current);
    if (this.employer.Current == true)
      this.currItem = this.currentList[1].name;
    else if (this.employer.Current == false)
      this.currItem = this.currentList[0].name;
  }
  setSalType(){
    if (this.employer.SalaryType == SalaryType.annual)
      this.salItem = this.salList[1].name;
    else if(this.employer.SalaryType == SalaryType.hourly)
      this.salItem = this.salList[0].name;
  }

  goToNextOrPrevEmp(next: boolean){
    if (this.fieldsModified == true){
      this.dialog.open(DialogDataRRMSDialog, {
        data: {
          inError: false,
          title: "Unsaved Changes",
          contentSummary: "Warning. There are unsaved Changes. Would you still like to proceed, or save?",
          errorItems: []
        }
        }).afterClosed().subscribe((choosesSave: boolean)=> {
          if (choosesSave == true){
            this.updateEmp().then((saveSuccess: boolean) => {
              console.log("updating employer");
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updatecurrentEmployerIndex(next);
                this.getSettings();
              }
            });
          }
          else{
            console.log("not updating employer");
            this.fieldsModified = false;
            console.log("original settings are " + JSON.stringify(this.origSettings));
            //this.fillInputsWithOriginalSettings();
            this.updatecurrentEmployerIndex(next);
            this.getSettings();
          }
        });
    }
    else{
      this.updatecurrentEmployerIndex(next);
      this.getSettings();
    }
  }
  updatecurrentEmployerIndex(next: boolean)
  {
    if (next == true){
      this.currentEmployerIndex = (this.currentEmployerIndex + 1) % (<any[]>this.data.employers).length;
    }
    else if(next == false){ // If navigating to "previous"
      this.currentEmployerIndex--;
      if (this.currentEmployerIndex < 0){
        this.currentEmployerIndex = (<any[]>this.data.employers).length - 1;
      }
    }
  }

  closeModifyEmpDialog(){
    // If "Yes", the map will return true, otherwise, false. 
    console.log("Sending back " + JSON.stringify(this.employers));
    if (this.addMode == false)
      this.dialogRef.close(this.employers);
    else if(this.addMode == true)
      this.dialogRef.close(null);
  }
  fillInputsWithOriginalSettings(){
    this.employer.CompanyName = this.origSettings.CompanyName;
    this.employer.MgrFName = this.origSettings.MgrFName;
    this.employer.MgrLName = this.origSettings.MgrLName;
    this.employer.MgrEmailAddress = this.origSettings.MgrEmailAddress;
    this.employer.MgrPhoneNumber = this.origSettings.MgrPhoneNumber;
    this.employer.AddressStreet1 = this.origSettings.AddressStreet1;
    this.employer.AddressStreet2 = this.origSettings.AddressStreet2;
    this.employer.AddressCity = this.origSettings.AddressCity;
    this.employer.AddressState = this.origSettings.AddressState;
    this.employer.AddressZipCode = this.origSettings.AddressZipCode;
    this.employer.ProspectJobTitle = this.origSettings.ProspectJobTitle;
    this.employer.StartDate = this.origSettings.StartDate;
    this.employer.EndDate = this.origSettings.EndDate;
    this.employer.Current = this.origSettings.Current;
  }
  saveBtnClickedUpdate(){
    this.updateEmp().then(() => {
        // Do nothing
    })
    .catch((err) => {
      console.log(err);
    })
  }
  createBtnClickedUpdate(){
    this.createEmp().then(() => {
      // Do nothing
      this.dialogRef.close(this.employer);
  })
  .catch((err) => {
    console.log(err);
  })
  }
  createEmp(){
    console.log("before creating, ProspectID is " + this.data.prospectId);
    this.employer = {
      CompanyName: this.cmpyNameInput.value,
      Id: -1,
      MgrEmailAddress : this.emailInput.value,
      MgrPhoneNumber: this.phoneInput.value,
      MgrFName : this.fNameInput.value,
      MgrLName : this.lNameInput.value,
      AddressStreet1: this.addressStreet1Input.value,
      AddressStreet2: this.addressStreet2Input.value,
      AddressCity: this.cityInput.value,
      AddressState: this.stateInput.value,
      AddressZipCode: this.zipcodeInput.value,
      ProspectJobTitle: this.jobTitleInput.value,
      StartDate: this.startDateInput.value,
      EndDate: this.endDateInput.value,
      Current: this.currentMap.get(this.currItem),
      SalaryType: this.salMap.get(this.salItem),
      ProspectId: this.data.prospectId,
    }
    return new Promise((resolve, reject) => {
      console.log("about to save with EmployerId = ", this.employer.Id);
      this.employerService.saveEmployer(this.employer).then(() => {
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "Employer Saved",
            contentSummary: "This Employer has been Saved",
            errorItems: []
          }
          }).afterClosed().subscribe((addRooms: boolean)=> {
            this.fieldsModified = false;
            resolve(true);
          });
      }).catch((err) => {
        console.log(err);
        reject(false);
      });
    });
  }

  updateEmp(){
    //TODO
    this.employer = {
      CompanyName: this.employer.CompanyName,
      Id: this.employer.Id,
      MgrEmailAddress : this.emailInput.value,
      MgrPhoneNumber: this.phoneInput.value,
      MgrFName : this.fNameInput.value,
      MgrLName : this.lNameInput.value,
      AddressStreet1: this.addressStreet1Input.value,
      AddressStreet2: this.addressStreet2Input.value,
      AddressCity: this.cityInput.value,
      AddressState: this.stateInput.value,
      AddressZipCode: this.zipcodeInput.value,
      ProspectJobTitle: this.jobTitleInput.value,
      StartDate: this.startDateInput.value,
      EndDate: this.endDateInput.value,
      Current: this.currentMap.get(this.currItem),
      SalaryType: this.salMap.get(this.salItem),
      ProspectId: this.employer.ProspectId,
    }
    this.employers[this.currentEmployerIndex] = this.employer;
    return new Promise((resolve, reject) => {
      console.log("about to save with EmployerId = ", this.employer.Id);
      this.employerService.updateEmployer(this.employer).then(() => {
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "Employer Saved",
            contentSummary: "This Employer has been Saved",
            errorItems: []
          }
          }).afterClosed().subscribe((addRooms: boolean)=> {
            this.fieldsModified = false;
            resolve(true);
          });
      }).catch((err) => {
        console.log(err);
        reject(false);
      });
    });
  }
  getInputErrorMessage(inputField : AbstractControl){
    if (inputField.dirty == true){
      if (inputField.hasError('required')) {
        return 'You must enter a value';
      }
      if (inputField.hasError(inputField.value)){
          return "Not a valid entry"; 
      }
    }
  }

  deleteBtnClicked(){
    this.dialog.open(DialogDataRRMSDialog, {
      data: {
        inError: false,
        title: "Delete - Are you sure?",
        contentSummary: "Are you sure you would like to delete this Employer?",
        errorItems: []
      }
    }).afterClosed().subscribe((deleteEmp: boolean)=> {
      if (deleteEmp == true ){       
        this.employerService.removeEmployer(this.employer.Id);
        this.employers = Array.from(this.employers).filter(emp => emp.Id != this.employer.Id);
        this.dialogRef.close(this.employers); // this needs to return a null
      }
    });

  }
}
