import { Component, Inject, OnInit, Renderer2, Type, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MDBModalRef, MDBModalService, ModalDirective } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
import {IEmployer, SalaryType} from '../interfaces/Employer';
import {EmployerService} from '../services/employer.service';

interface ICurrentEmp{
  name: string;
  current: boolean;
  checked: boolean;
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
  styleUrls: ['./modify-employer-modal.component.scss']
})
export class ModifyEmployerModalComponent implements OnInit{
  @ViewChild('modempmodal') public modal: ModalDirective;
  action: Subject<any> = new Subject();
  modalRef: MDBModalRef;
  prospectId: number;
  editImageSrcMFName : string = '../../../assets/edit_icon.svg';
  editImageSrcMLName : string = '../../../assets/edit_icon.svg';
  editImageSrcMEmail : string = '../../../assets/edit_icon.svg';
  editImageSrcMPhone : string = '../../../assets/edit_icon.svg';
  editImageSrcCmpySt1 : string = '../../../assets/edit_icon.svg';
  editImageSrcCmpySt2 : string = '../../../assets/edit_icon.svg';
  editImageSrcCmpyCty : string = '../../../assets/edit_icon.svg';
  editImageSrcCmpySt : string = '../../../assets/edit_icon.svg';
  editImageSrcCmpyZip : string = '../../../assets/edit_icon.svg';
  editCompanyNameIcon : string = '../../../assets/edit_icon.svg';
  editImageSrcJobTtl : string = '../../../assets/edit_icon.svg';
  editHrRateIcon : string = '../../../assets/edit_icon.svg';
  editSalAmtIcon : string = '../../../assets/edit_icon.svg';
  closeIconSrc : string = '../../../assets/close_door.svg'
  deleteEmpSrcIcon : string = '../../../assets/delete_employer_icon.svg'
  backButtonImgSrc : string = '../../../assets/left_arrow_prospect.svg'
  nextButtonImgSrc : string = '../../../assets/left_arrow_prospect.svg'
  saveApplied: boolean = false;
  addMode: boolean;
  currEmp:string;
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
  dateObserverablesEnabled: boolean = false;
  editCity: boolean = false;
  editState: boolean = false;
  editZipcode: boolean = false;
  editJobTitle: boolean = false;
  editStartDate: boolean = false;
  editEndDate: boolean = false;
  editHrRate: boolean = false;
  editSalAmt: boolean = false;
  fieldsModified: boolean = false;
  currentEmployerIndex: number = 0;
  employerCount: number = 0;
  employer: IEmployer = null;
  employers: Iterable<IEmployer>;
  selectedRoomId : number;
  cmpyNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[.@&]?[a-zA-Z0-9 ]+[ !.@&()]?[ a-zA-Z0-9!()]+/)]);
  cmpyLogoSrc : string = null;

  hrRateInput : FormControl = new FormControl('', [Validators.pattern(/^([0-9]){1,4}(\.){0,1}([0-9]){0,2}$/)]);
  salaryAmtInput : FormControl = new FormControl('', [Validators.pattern(/^([0-9]){1,9}$/)]);
  fNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  lNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  emailInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  mdInitInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  phoneInput = new FormControl('', [Validators.required, Validators.pattern(/^((((\(\d{3}\) ?)|(\d{3}-{1}))\d{3}-{1}\d{4})|(([0-9]){10}))$/)]);
  addressStreet1Input = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2Input  = new FormControl('', [Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  cityInput = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  stateInput  = new FormControl('',[Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  zipcodeInput = new FormControl('',  [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  jobTitleInput = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,30}')]);
  startDateInput = new FormControl('', [Validators.required]);
  endDateInput = new FormControl('', [Validators.required]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : TermType = TermType.monthToMonth;
  currentList:Iterable<ICurrentEmp> = [
    { "name": "No", current: false, checked: true},
    { "name": "Yes", current: true, checked: false}
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
 
  constructor(/*@Inject(MAT_DIALOG_DATA) public data: any, */
  /*public dialog: MatDialog,*/
  private employerService: EmployerService, 
  private modalService: MDBModalService,
  private _renderer: Renderer2,

  ) {
    this.cmpyNameInput.valueChanges.subscribe((val : string) => {
      if (val != null){
        this.cmpyLogoSrc = 'https://logo.clearbit.com/' + this.cmpyNameInput.value + '.com?size=200';
      }
      else{
        this.cmpyLogoSrc = 'https://logo.clearbit.com/' + this.employer.CompanyName + '.com?size=200';
      }
      console.log("updating this.cmpyLogoSrc to " + this.cmpyLogoSrc)
      this.cmpyLogoSrc = 'https://logo.clearbit.com/' + this.employer.CompanyName + '.com?size=200';

    });    
  }
  onClose(){
    this.closeModifyEmpDialog();
  }
  getCmpyNameSrc(){
    let retVal = null;
    if (this.employer != null)
    retVal = this.employer.CompanyName.replace(/\s/g, "");
    return retVal;
  }
  enableDateObservables(){

    this.startDateInput.valueChanges.subscribe((val : Date) => {
      if (this.dateObserverablesEnabled == true){
        if (val != null)
        {
         console.log("in valueChanges()");
         this.employer.StartDate = new Date(val.toISOString());
         this.fieldsModified = true;
        }
        else{
          return;
        } 
      }
    });
    this.endDateInput.valueChanges.subscribe((val : Date) => {
      if (this.dateObserverablesEnabled == true){
        if (val != null)
        {
         console.log("in valueChanges()");
         this.fieldsModified = true;
         this.employer.EndDate = new Date(val.toISOString());
        }
        else{
          return;
        } 
      }
    });
  }
  ngOnInit(): void {
    this.setRadioButtonDefaults();
    
    if (this.addMode == false){
      this.addMode = false;
      if (this.employers != null)
      {  
          this.setOrigSettings(this.employers[this.currentEmployerIndex]);
          this.getSettings();
          this.employerCount = (<any[]>this.employers).length;
      }
    }
    this.dateObserverablesEnabled = true;
    this.enableDateObservables();
  }
  setRadioButtonDefaults(){
    this.currEmp = "No";
    this.salItem = "Hourly";
  }
  setOrigSettings(employer : IEmployer)
  {
   this.origSettings = Object.assign({}, employer);
  }
  moveDatesValid(){
    let tmpStart = new Date(this.startDateInput.value);
    let tmpEnd = new Date(this.endDateInput.value);

    console.log("in moveDatesValid:  start date: " + (tmpStart) + ", end date: " + (tmpStart));
    if (this.currEmp == "Yes" && this.startDateInput.value == false){
      console.log("Start date is false");
      return false;
    }

    if (this.currentMap.get(this.currEmp) == true){
      return true;
    }
    if ((tmpStart) <= (tmpEnd)){
      return true;
    }
    else{
      // Not valid if Move out date comes before move-in date
      return false;
    }
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
      case 'hrRate': { 
        this.editHrRate = !this.editHrRate;
      }
      break; 
      case 'salAmt': { 
        this.editSalAmt = !this.editSalAmt;
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
      switch(editStr) { 
        case 'cmpyname': { 
          if (this.cmpyNameInput.valid == true)
          {
            this.employer.CompanyName = this.cmpyNameInput.value;
            
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'fname': { 
          if (this.fNameInput.valid == true)
          {
            this.employer.MgrFName = this.fNameInput.value;
            
          }
          else{
            this.changeEditMode(editStr);
            return;
          } 
        } 
        break; 
        case 'lname': { 
          if (this.lNameInput.valid == true)
          {
            this.employer.MgrLName = this.lNameInput.value;
            
          }
          else{
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
        case 'hrRate':{
          if (this.hrRateInput.valid == true){
            this.employer.HourlyRate = this.hrRateInput.value;
          }
          else{
            this.changeEditMode(editStr);
          }
        }
        break;
        case 'salAmt':{
          if (this.salaryAmtInput.valid == true){
            this.employer.SalaryAmt = this.salaryAmtInput.value;
          }
          else{
            this.changeEditMode(editStr);
          }
        }
        break;
        
      }
      this.changeEditMode(editStr);
      this.fieldsModified = true;
    }
  }

  getSettings(){
    console.log("currentEmployerIndex is " + this.currentEmployerIndex);
    console.log("this.employers is " + JSON.stringify(this.employers))
    if (this.employers != null)
      this.employer = this.employers[this.currentEmployerIndex];

      if (this.employer != null)
      {
        console.log("in getSettings(), setting jobtitle to " + this.employer.ProspectJobTitle);
        console.log("in getSettings(), this.employer.StartDate is " + JSON.stringify(this.employer.StartDate))
        this.cmpyNameInput.setValue(this.employer.CompanyName);
        this.fNameInput.setValue(this.employer.MgrFName);
        this.lNameInput.setValue(this.employer.MgrLName);
        this.emailInput.setValue(this.employer.MgrEmailAddress);
        this.phoneInput.setValue(this.employer.MgrPhoneNumber);
        this.addressStreet1Input.setValue(this.employer.AddressStreet1);
        this.addressStreet2Input.setValue(this.employer.AddressStreet2);
        this.cityInput.setValue(this.employer.AddressCity);
        this.stateInput.setValue(this.employer.AddressState);
        this.zipcodeInput.setValue(this.employer.AddressZipCode);
        this.jobTitleInput.setValue(this.employer.ProspectJobTitle);
        this.startDateInput.setValue(this.employer.StartDate);
        if (this.employer.HourlyRate == null){
          console.log("rate is null");
          this.hrRateInput.setValue(0.00);
        }
        else{
          this.hrRateInput.setValue(this.employer.HourlyRate);
        }
        if (this.employer.SalaryAmt == null){
          console.log("rate is null");
          this.salaryAmtInput.setValue(0);
        }
        else{
          this.salaryAmtInput.setValue(this.employer.SalaryAmt);
        }
        if (this.employer.EndDate != null){
          this.endDateInput.setValue(this.employer.EndDate);
        }
        this.setCurrentEmp(); // Radio button for if employer is current
        this.setSalType(); // Radio button for salary item for employer
    }
  }

  setCurrentEmp(){
    console.log("in setCurrentEmp(), this.employer.Current is " + JSON.stringify(this.employer.Current));
    if (this.employer.Current == true)
      this.currEmp = this.currentList[1].name;
    else if (this.employer.Current == false)
      this.currEmp = this.currentList[0].name;
  }
  setSalType(){
    if (this.employer.SalaryType == SalaryType.annual)
      this.salItem = this.salList[1].name;
    else if(this.employer.SalaryType == SalaryType.hourly)
      this.salItem = this.salList[0].name;
  }

  goToNextOrPrevEmp(next: boolean){
    this.dateObserverablesEnabled = false;

    if (this.fieldsModified == true){
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: false,
          title: "Unsaved Changes",
          contentSummary: "Warning. There are unsaved Changes. Would you still like to proceed, or save?",
          errorItems: []
        }
        });
        this.modalRef.content.action.subscribe((choosesSave: boolean)=> {
          this.modalRef.hide();
          if (choosesSave == true){
            this.updateEmp().then((saveSuccess: boolean) => {
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updatecurrentEmployerIndex(next);
                this.getSettings();
                this.dateObserverablesEnabled = true;
              }
            });
          }
          else{
            this.fieldsModified = false;
            //this.fillInputsWithOriginalSettings();
            this.updatecurrentEmployerIndex(next);
            this.getSettings();
            this.dateObserverablesEnabled = true;
          }
        },
        error =>{
          console.log(error);
          this.modalRef.hide();
        });
    }
    else{
      this.updatecurrentEmployerIndex(next);
      this.getSettings();
      this.dateObserverablesEnabled = true;
    }
  }
  updatecurrentEmployerIndex(next: boolean)
  {
    if (next == true){
      this.currentEmployerIndex = (this.currentEmployerIndex + 1) % (<any[]>this.employers).length;
    }
    else if(next == false){ // If navigating to "previous"
      this.currentEmployerIndex--;
      if (this.currentEmployerIndex < 0){
        this.currentEmployerIndex = (<any[]>this.employers).length - 1;
      }
    }
  }

  closeModifyEmpDialog(){
    if (this.fieldsModified == true || this.addMode == true){
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: false,
          title: "Unsaved Changes",
          contentSummary: "Warning. There are unsaved Changes. Would you still like to proceed, or save?",
          errorItems: []
        }
        });
        this.modalRef.content.action.subscribe((choosesSave: boolean)=> {
          this.modalRef.hide();
          if (choosesSave == true){
            this.updateEmp().then((saveSuccess: boolean) => {
              this.action.next(this.employers);
            });
          }
          else{
            console.log("in final else and addmode is " + this.addMode);
            // TODO
            this.action.next(null);
          }
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
      }
      else{
        // Current issue: If I close the window and have already saved.. the parent will reset to original
        if (this.saveApplied == true)
        {
          this.action.next(this.employers);
        }
        else{
          this.action.next(null);
        }
      }
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
    this.updateEmp();
  }
  createBtnClickedUpdate(){
    
    if (this.moveDatesValid() == true){
      if (this.salMap.get(this.salItem) == SalaryType.annual){
        this.hrRateInput.setValue(0);
      }
      else if(this.salMap.get(this.salItem) == SalaryType.hourly){
        this.salaryAmtInput.setValue(0);
      }
      if (this.inputsAreValid() == true){
        this.createEmp().then(() => {
          this.action.next(this.employers);
        })
        .catch((err) => {
          console.log(err);
        })
      }
    }
    else{
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          title: "Incorrect Dates",
          contentSummary: "Invalid Dates. Please Verify dates are correct. Start Date should precede End Date",
        }
        });
        this.modalRef.content.action.subscribe(()=> {
          this.modalRef.hide();
          return Promise.resolve(true);
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
    }
  }
  createEmp(){
    console.log("job title: " + this.jobTitleInput.value);
    console.log("in createEmp()")
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
      Current: this.currentMap.get(this.currEmp),
      SalaryType: this.salMap.get(this.salItem),
      ProspectId: this.prospectId,
      HourlyRate: this.hrRateInput.value,
      SalaryAmt : this.salaryAmtInput.value,
    }
    return new Promise((resolve, reject) => {
      this.employerService.saveEmployer(this.employer).then(() => {
        this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
          backdrop: true,
          keyboard: true,
          focus: true,
          show: false,
          ignoreBackdropClick: false,
          class: '',
          containerClass: '',
          animated: true,
          data: {
            inError: false,
            title: "Employer Saved",
            contentSummary: "This Employer has been Saved",
            errorItems: []
          }
          });
          this.modalRef.content.action.subscribe(()=> {
            this.modalRef.hide();
            this.fieldsModified = false;
            resolve(true);
          },
          error => {
            console.log(error);
            this.modalRef.hide();
          });
      }).catch((err) => {
        this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
          backdrop: true,
          keyboard: true,
          focus: true,
          show: false,
          ignoreBackdropClick: false,
          class: '',
          containerClass: '',
          animated: true,
          data: {
            inError: true,
            title: "Unable to process",
            contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
            errorItems: []
          }
        });
        this.modalRef.content.action.subscribe(()=> {
          this.modalRef.hide();
          resolve(false);
        },
        error => {
          console.log(error);
          this.modalRef.hide();
          reject(false);
        });
      });
    });
  }
  inputsAreValid():boolean {
    let invalidElements = new Array();
    if (this.currEmp == null){
      console.log("current emp is null");
      invalidElements.push("Current Employer (toggle)");
    }
    if (this.cmpyNameInput.invalid){
      invalidElements.push("Company Name");
    }
    if (this.jobTitleInput.invalid){
      invalidElements.push("Job Title");
    }
    if (this.fNameInput.invalid){
      invalidElements.push("First Name");
    }
    if (this.lNameInput.invalid){
      invalidElements.push("Last Name");
    }
    if (this.emailInput.invalid){
      invalidElements.push("Email");
    }
    if (this.phoneInput.invalid){
      invalidElements.push("Phone Number");
    }
    if (this.addressStreet1Input.invalid){
      invalidElements.push("Address (1)");
    }
    if (this.addressStreet2Input.invalid){
      invalidElements.push("Address (2)");
    }
    if (this.cityInput.invalid){
      invalidElements.push("City");
    }
    if (this.stateInput.invalid){
      invalidElements.push("State");
    }
    if (this.zipcodeInput.invalid){
      invalidElements.push("Zipcode");
    }
    if (this.salaryAmtInput.invalid){
      invalidElements.push("Salary Amount");
    }
    if (this.hrRateInput.invalid){
      invalidElements.push("Hourly Rate");
    }
    if (invalidElements.length > 0)
    {
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: true,
          title: "Invalid Items",
          contentSummary: "The following items are invalid",
          errorItems: invalidElements
        }
      });
      this.modalRef.content.action.subscribe(() => {
        this.modalRef.hide();
        return false;
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
    }else{
      return true;
    }
  }

  updateEmp(){
    console.log("Before updating employer is "+ JSON.stringify(this.employer))

    if (this.moveDatesValid() == true){
      if (this.salMap.get(this.salItem) == SalaryType.annual){
        this.hrRateInput.setValue(0);
      }
      else if(this.salMap.get(this.salItem) == SalaryType.hourly){
        this.salaryAmtInput.setValue(0);
      }
      if (this.inputsAreValid() == true){
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
          Current: this.currentMap.get(this.currEmp),
          SalaryType: this.salMap.get(this.salItem),
          ProspectId: this.employer.ProspectId,
          HourlyRate: this.hrRateInput.value,
          SalaryAmt: this.salaryAmtInput.value,
        }
        this.employers[this.currentEmployerIndex] = this.employer;
        return new Promise((resolve, reject) => {
          this.employerService.updateEmployer(this.employer).then(() => {
            this.saveApplied = true;
            this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
              backdrop: true,
              keyboard: true,
              focus: true,
              show: false,
              ignoreBackdropClick: false,
              class: '',
              containerClass: '',
              animated: true,
              data: {
                inError: false,
                title: "Employer Saved",
                contentSummary: "This Employer has been Saved",
                errorItems: []
              }
              });
              this.modalRef.content.action.subscribe(()=> {
                this.modalRef.hide();
                this.fieldsModified = false;
                resolve(true);
              },
              error =>{
                console.log(error);
                this.modalRef.hide();
              });
          }).catch((err) => {
            this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
              backdrop: true,
              keyboard: true,
              focus: true,
              show: false,
              ignoreBackdropClick: false,
              class: '',
              containerClass: '',
              animated: true,
              data: {
                inError: true,
                title: "Unable to process",
                contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
                errorItems: []
              }
            });
            this.modalRef.content.action.subscribe(()=> {
              this.modalRef.hide();
              resolve(false);
            },
            error => {
              console.log(error);
              this.modalRef.hide();
              reject(false);
            });
          });
        });
      }
  }
  else{
    // Move in/moveout date combination is not valid
    this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: '',
      containerClass: '',
      animated: true,
      data: {
        title: "Incorrect Dates",
        contentSummary: "Invalid Dates. Please Verify dates are correct. Start Date should precede End Date",
      }
      });
      this.modalRef.content.action.subscribe(()=> {
        this.modalRef.hide();
        return Promise.resolve(true);
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
  }
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

  addZeroes(num) {
    const dec = num.split('.')[1]
    const len = dec && dec.length > 2 ? dec.length : 2
    return Number(num).toFixed(len)
  }

  getAnnualSalDisplay(){
    if (this.employer.SalaryAmt != null){
      return "$" + this.employer.SalaryAmt + "k per year";
    }
    else{
      return "$0k per Year";
    }
  }

  getHrRateDisplay(){
    if (this.employer.HourlyRate != null)
    {
      return '$' + this.addZeroes(this.employer.HourlyRate.toString()) + " per hour";
    }
    else{
      return "$0.00 per hour";
    }
  }

  deleteBtnClicked(){
    this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: '',
      containerClass: '',
      animated: true,
      data: {
        inError: false,
        title: "Delete - Are you sure?",
        contentSummary: "Are you sure you would like to delete this Employer?",
        errorItems: []
      }
    });
    this.modalRef.content.action.subscribe((deleteEmp: boolean)=> {
      this.modalRef.hide();

      if (deleteEmp == true ){
        this.employerService.removeEmployer(this.employer.Id).then(() => {
          this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
            backdrop: true,
            keyboard: true,
            focus: true,
            show: false,
            ignoreBackdropClick: false,
            class: '',
            containerClass: '',
            animated: true,
            data: {
              inError: true,
              title: "Employer Deleted",
              contentSummary: `${this.employer.CompanyName} has been Removed`,
              errorItems: []
            }
          });
          this.modalRef.content.action.subscribe(() => {
            this.modalRef.hide();
            // Close this dialog after delete confirm window
            this.action.next(null);
          },
          error => {
            console.log(error);
            if (this.modalRef != null)
              this.modalRef.hide();
            this.action.next(null);
          });
      }).catch((err) => {
        this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
          backdrop: true,
          keyboard: true,
          focus: true,
          show: false,
          ignoreBackdropClick: false,
          class: '',
          containerClass: '',
          animated: true,
          data: {
            inError: true,
            title: "Unable to process",
            contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
            errorItems: []
          }
        });
        this.modalRef.content.action.subscribe(()=> {
          this.modalRef.hide();
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
      });
      } 
    },
    error => {
      console.log(error);
      this.modalRef.hide();
    });

  }
}
