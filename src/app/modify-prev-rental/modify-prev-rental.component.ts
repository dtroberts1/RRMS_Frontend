import { ArrayDataSource } from '@angular/cdk/collections';
import { ComponentType, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Inject, Injectable, Injector, OnInit, TemplateRef, Type } from '@angular/core';
import { AbstractControl, FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { tap, toArray } from 'rxjs/operators';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
import {IPreviousRental} from '../interfaces/PreviousRental';
import {PreviousRental} from '../services/prevrental.service';

interface ICurrentEmp{
  name: string;
  current: boolean;
};

export enum TermType {
  monthToMonth = 1,
  fixedTerm = 2,
}
@Component({
  selector: 'app-modify-prev-rental',
  providers:[MatDialog],
  templateUrl: './modify-prev-rental.component.html',
  styleUrls: ['./modify-prev-rental.component.scss'],

})
@Injectable({
  providedIn: 'root'
})
export class ModifyPrevRentalComponent implements OnInit{
  action: Subject<any> = new Subject();
  modalRef: MDBModalRef;

  fNameIcon : string = '../../../assets/edit_icon.svg';
  lNameIcon : string = '../../../assets/edit_icon.svg';
  emailIcon : string = '../../../assets/edit_icon.svg';
  phoneIcon : string = '../../../assets/edit_icon.svg';
  add1Icon : string = '../../../assets/edit_icon.svg';
  add2Icon: string = '../../../assets/edit_icon.svg';
  addCityIcon: string = '../../../assets/edit_icon.svg';
  addStateIcon: string = '../../../assets/edit_icon.svg';
  prevRentalIcon: string = '../../../assets/edit_icon.svg';
  closeIconSrc: string = '../../../assets/close_door.svg';
  deleteIconSrc: string = '../../../assets/remove_home.svg';
  nextButtonImgSrc: string = '../../../assets/left_arrow_prospect.svg';
  backButtonImgSrc: string =  '../../../assets/left_arrow_prospect.svg';
  prospectId: number;
  addMode: boolean;
  currItem:string;
  salItem: string;
  homeImagePath : string;
  origSettings : IPreviousRental;
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
  editStartDate: boolean = false;
  editEndDate: boolean = false;
  fieldsModified: boolean = false;
  currentprevRentalIndex: number;
  prevRentalCount: number;
  prevRental: IPreviousRental;
  prevRentals: Iterable<IPreviousRental>;
  selectedRoomId : number;
  fNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  lNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  emailInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  mdInitInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  phoneInput = new FormControl('', [Validators.required, Validators.pattern(/^((((\(\d{3}\) ?)|(\d{3}-{1}))\d{3}-{1}\d{4})|(([0-9]){10}))$/)]);
  addressStreet1Input = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2Input  = new FormControl('', [Validators.pattern(/^((APT|APARTMENT|SUITE|STE|UNIT){1} (NUMBER|NO|#)(\s){0,1}([0-9A-Z-]+)){0,1}/i)]);
  cityInput = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  stateInput  = new FormControl('',[Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  zipcodeInput = new FormControl('',  [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  startDateInput = new FormControl('', [Validators.required]);
  endDateInput = new FormControl('', [Validators.required]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : TermType = TermType.monthToMonth;
  dateObserverablesEnabled: boolean = false;

  currentList:Iterable<ICurrentEmp> = [
    { "name": "No", current: false},
    { "name": "Yes", current: true}
]
currentMap = new Map<string, boolean>([
  ['No', false],
  ['Yes', true]
]);
 
  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
  selectedRoomName : string = 'No Room Selected';
 
  constructor(
  public dialog: MatDialog,
  private prevRentalService: PreviousRental, 
  private modalService: MDBModalService
  ) {
  }

ngOnInit(): void {
  console.log("in modal");
  if (this.addMode == true)
      this.addMode = true;
  else if (this.addMode == false){
    this.addMode = false;
    if (this.prevRentals != null)
    {  
        this.setOrigSettings(this.prevRentals[this.currentprevRentalIndex]);
        this.getSettings();
        this.prevRentalCount = (<any[]>this.prevRentals).length;
    }
  }
  this.dateObserverablesEnabled = true;
  this.enableDateObservables();
  }

  setOrigSettings(prevRental : IPreviousRental)
  {
   this.origSettings = Object.assign({}, prevRental);
  }
  enableDateObservables(){

    this.startDateInput.valueChanges.subscribe((val : Date) => {
      if (this.dateObserverablesEnabled == true){
        if (val != null)
        {
         console.log("in valueChanges()");
         this.prevRental.StartDate = new Date(val.toISOString());
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
         this.prevRental.EndDate = new Date(val.toISOString());
        }
        else{
          return;
        } 
      }
    });
  }
  canDispNextAndPrev(){
    if (this.prevRentalCount > 1)
      return true;
    return false;
  }

  datesValid(){
    let tmpStart = new Date(this.startDateInput.value);
    let tmpEnd = new Date(this.endDateInput.value);

    console.log("in moveDatesValid:  start date: " + (tmpStart) + ", end date: " + (tmpStart));
    if (this.currentMap.get(this.currItem) == true){
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

  changeEditMode(str:string){
    switch(str) { 
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
      console.log("updating input");
      switch(editStr) { 
        case 'fname': { 
          if (this.fNameInput.valid == true)
          {
            this.prevRental.PrevLandlordFName = this.fNameInput.value;
            
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
            this.prevRental.PrevLandlordLName = this.lNameInput.value;
            
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
            this.prevRental.PrevLandlordEmailAddress = this.emailInput.value;
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
            this.prevRental.PrevLandlordPhoneNumber = this.phoneInput.value;
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
            this.prevRental.AddressStreet1 = this.addressStreet1Input.value;
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
            this.prevRental.AddressStreet2 = this.addressStreet2Input.value;
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
            this.prevRental.AddressCity = this.cityInput.value;
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
            this.prevRental.AddressState = this.stateInput.value;
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
            this.prevRental.AddressZipCode = this.zipcodeInput.value;
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
            this.prevRental.StartDate = this.startDateInput.value;
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
            this.prevRental.EndDate = this.endDateInput.value;
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
    this.prevRental = this.prevRentals[this.currentprevRentalIndex];

    this.fNameInput.setValue(this.prevRental.PrevLandlordFName);
    this.lNameInput.setValue(this.prevRental.PrevLandlordLName);
    this.emailInput.setValue(this.prevRental.PrevLandlordEmailAddress);
    this.phoneInput.setValue(this.prevRental.PrevLandlordPhoneNumber);
    this.addressStreet1Input.setValue(this.prevRental.AddressStreet1);
    this.addressStreet2Input.setValue(this.prevRental.AddressStreet2);
    this.cityInput.setValue(this.prevRental.AddressCity);
    this.stateInput.setValue(this.prevRental.AddressState);
    this.zipcodeInput.setValue(this.prevRental.AddressZipCode);
    console.log('setting value to ' + this.prevRental.StartDate);
    this.startDateInput.setValue(this.prevRental.StartDate);
    this.endDateInput.setValue(this.prevRental.EndDate);
    this.setCurrentEmp(); // Radio button for if prevRental is current
    this.setSalType(); // Radio button for salary item for prevRental
  }

  setCurrentEmp(){
    if (this.prevRental.Current == true)
      this.currItem = this.currentList[1].name;
    else if (this.prevRental.Current == false)
      this.currItem = this.currentList[0].name;
  }
  setSalType(){

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
        })
        this.modalRef.content.action.subscribe((choosesSave: boolean)=> {
          if (choosesSave == true){
            this.updateEmp().then((saveSuccess: boolean) => {
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updatecurrentprevRentalIndex(next);
                this.getSettings();
                this.dateObserverablesEnabled = true;
              }
            });
          }
          else{
            this.fieldsModified = false;
            //this.fillInputsWithOriginalSettings();
            this.updatecurrentprevRentalIndex(next);
            this.getSettings();
            this.dateObserverablesEnabled = true;
          }
          this.modalRef.hide();
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
    }
    else{
      this.updatecurrentprevRentalIndex(next);
      this.getSettings();
      this.dateObserverablesEnabled = true;
    }
  }
  updatecurrentprevRentalIndex(next: boolean)
  {
    if (next == true){
      this.currentprevRentalIndex = (this.currentprevRentalIndex + 1) % (<any[]>this.prevRentals).length;
    }
    else if(next == false){ // If navigating to "previous"
      this.currentprevRentalIndex--;
      if (this.currentprevRentalIndex < 0){
        this.currentprevRentalIndex = (<any[]>this.prevRentals).length - 1;
      }
    }
  }

  closePrevRentalDialog(){
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
            this.updateEmp().then(() => {
              this.action.next(null);
            })
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
        this.action.next(null);

      }
  }

  fillInputsWithOriginalSettings(){
    this.prevRental.PrevLandlordFName = this.origSettings.PrevLandlordFName;
    this.prevRental.PrevLandlordLName = this.origSettings.PrevLandlordLName;
    this.prevRental.PrevLandlordEmailAddress = this.origSettings.PrevLandlordEmailAddress;
    this.prevRental.PrevLandlordPhoneNumber = this.origSettings.PrevLandlordPhoneNumber;
    this.prevRental.AddressStreet1 = this.origSettings.AddressStreet1;
    this.prevRental.AddressStreet2 = this.origSettings.AddressStreet2;
    this.prevRental.AddressCity = this.origSettings.AddressCity;
    this.prevRental.AddressState = this.origSettings.AddressState;
    this.prevRental.AddressZipCode = this.origSettings.AddressZipCode;
    this.prevRental.StartDate = this.origSettings.StartDate;
    this.prevRental.EndDate = this.origSettings.EndDate;
    this.prevRental.Current = this.origSettings.Current;
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
    if (this.datesValid() == true){
      if (this.inputsAreValid() == true){  
        this.createPrevRental().then(() => {
          this.action.next(this.prevRental);
          
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
  
  createPrevRental(){
    this.prevRental = {
      Id: -1,
      PrevLandlordEmailAddress : this.emailInput.value,
      PrevLandlordPhoneNumber : this.phoneInput.value,
      PrevLandlordFName : this.fNameInput.value,
      PrevLandlordLName : this.lNameInput.value,
      AddressStreet1: this.addressStreet1Input.value,
      AddressStreet2: this.addressStreet2Input.value,
      AddressCity: this.cityInput.value,
      AddressState: this.stateInput.value,
      AddressZipCode: this.zipcodeInput.value,
      StartDate: this.startDateInput.value,
      EndDate: this.endDateInput.value,
      Current: this.currentMap.get(this.currItem),
      ProspectId: this.prospectId,
    }
    return new Promise((resolve, reject) => {
      console.log("about to save");

      this.prevRentalService.savePrevRental(this.prevRental).then(() => {
        console.log("saved. opening conf screen");
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
            title: "Previous Rental Saved",
            contentSummary: "This Previous Rental has been Saved",
            errorItems: []
          }
          })
          this.modalRef.content.action.subscribe((addPrevRental: boolean)=> {
            this.fieldsModified = false;
            console.log("conf screen closed");
            this.modalRef.hide();
            resolve(true);
          },
          error => {
            console.log(error);
            this.modalRef.hide();
            reject(false);
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
        });;
    });
  }

  inputsAreValid():boolean {
    let invalidElements = new Array();
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
    if (this.datesValid() == true){
      if (this.inputsAreValid() == true){
        this.prevRental = {
          Id: this.prevRental.Id,
          PrevLandlordEmailAddress : this.emailInput.value,
          PrevLandlordPhoneNumber : this.phoneInput.value,
          PrevLandlordFName : this.fNameInput.value,
          PrevLandlordLName : this.lNameInput.value,
          AddressStreet1: this.addressStreet1Input.value,
          AddressStreet2: this.addressStreet2Input.value,
          AddressCity: this.cityInput.value,
          AddressState: this.stateInput.value,
          AddressZipCode: this.zipcodeInput.value,
          StartDate: this.startDateInput.value,
          EndDate: this.endDateInput.value,
          Current: this.currentMap.get(this.currItem),
          ProspectId: this.prevRental.ProspectId,
        }
        this.prevRentals[this.currentprevRentalIndex] = this.prevRental;
        return new Promise((resolve, reject) => {
          this.prevRentalService.updatePrevRental(this.prevRental).then(() => {
            console.log("after update..");
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
                title: "Previous Rental Saved",
                contentSummary: "This Previous Rental has been Saved",
                errorItems: []
              }
          })
          this.modalRef.content.action.subscribe((addRooms: boolean)=> {
            this.fieldsModified = false;
            this.modalRef.hide();
            this.action.next();
            resolve(true);
            });
            }).catch((err) => {
              if (this.modalRef != null){
                this.modalRef.hide();
              }
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
        contentSummary: "Are you sure you would like to delete this previous rental?",
        errorItems: []
      }
    })
    this.modalRef.content.action.subscribe((deleteEmp: boolean)=> {
      this.modalRef.hide();
      if (deleteEmp == true ){       
        this.prevRentalService.removePrevRental(this.prevRental.Id).then(() => {
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
              title: "Previous Rental Deleted",
              contentSummary: `The Address at ${this.prevRental.AddressStreet1} has been Removed`,
              errorItems: []
            }
          });
          this.modalRef.content.action.subscribe(() => {
            this.modalRef.hide();
            this.action.next();
          },
          error => {
            console.log(error);
            this.modalRef.hide();
            this.action.next();
          });
        })
        .catch((error) => {
          console.log(error);
          this.action.next();
        })
        //this.prevRentals = Array.from(this.prevRentals).filter(prevRental => prevRental.Id != this.prevRental.Id);
      }
    },
    error => {
      console.log(error);
      this.modalRef.hide();
    });
  }
}
