import { ArrayDataSource } from '@angular/cdk/collections';
import { Component, Inject, OnInit, Type } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { toArray } from 'rxjs/operators';
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
  templateUrl: './modify-prev-rental.component.html',
  styleUrls: ['./modify-prev-rental.component.css']
})
export class ModifyPrevRentalComponent implements OnInit{
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
  phoneInput = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  addressStreet1Input = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2Input  = new FormControl('', [Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  cityInput = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  stateInput  = new FormControl('',[Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  zipcodeInput = new FormControl('',  [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  startDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  endDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : TermType = TermType.monthToMonth;
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
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  public dialogRef: MatDialogRef<ModifyPrevRentalComponent>,
  public dialog: MatDialog,
  private prevRentalService: PreviousRental, 
  ) {

  }
  ngOnInit(): void {
    this.prevRentals = this.data.prevRentals;
    this.currentprevRentalIndex = this.data.prevRentalIndex;
    if (this.prevRentals != null)
    {
      this.setOrigSettings(this.data.prevRentals[this.currentprevRentalIndex]);
      this.getSettings();
    }
    this.prevRentalCount = (<any[]>this.data.prevRentals).length;
    console.log("prevRentaCount is " + this.prevRentalCount);
    }
  setOrigSettings(prevRental : IPreviousRental)
  {
   this.origSettings = Object.assign({}, prevRental);
  }

  canDispNextAndPrev(){
    if (this.prevRentalCount > 1)
      return true;
    return false;
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
          this.prevRental.PrevLandlordPhone = this.phoneInput.value;
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

  getSettings(){
    this.prevRental = this.data.prevRentals[this.currentprevRentalIndex];

    this.fNameInput.setValue(this.prevRental.PrevLandlordFName);
    this.fNameInput.setValue(this.prevRental.PrevLandlordLName);
    this.emailInput.setValue(this.prevRental.PrevLandlordEmailAddress);
    this.phoneInput.setValue(this.prevRental.PrevLandlordPhone);
    this.addressStreet1Input.setValue(this.prevRental.AddressStreet1);
    this.addressStreet2Input.setValue(this.prevRental.AddressStreet2);
    this.cityInput.setValue(this.prevRental.AddressCity);
    this.stateInput.setValue(this.prevRental.AddressState);
    this.zipcodeInput.setValue(this.prevRental.AddressZipCode);
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
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updatecurrentprevRentalIndex(next);
                this.getSettings();
              }
            });
          }
          else{
            this.fieldsModified = false;
            //this.fillInputsWithOriginalSettings();
            this.updatecurrentprevRentalIndex(next);
            this.getSettings();
          }
        });
    }
    else{
      this.updatecurrentprevRentalIndex(next);
      this.getSettings();
    }
  }
  updatecurrentprevRentalIndex(next: boolean)
  {
    if (next == true){
      this.currentprevRentalIndex = (this.currentprevRentalIndex + 1) % (<any[]>this.data.prevRentals).length;
    }
    else if(next == false){ // If navigating to "previous"
      this.currentprevRentalIndex--;
      if (this.currentprevRentalIndex < 0){
        this.currentprevRentalIndex = (<any[]>this.data.prevRentals).length - 1;
      }
    }
  }

  closeModifyEmpDialog(){
    // If "Yes", the map will return true, otherwise, false. 
    this.dialogRef.close(this.prevRentals);
  }
  fillInputsWithOriginalSettings(){
    this.prevRental.PrevLandlordFName = this.origSettings.PrevLandlordFName;
    this.prevRental.PrevLandlordLName = this.origSettings.PrevLandlordLName;
    this.prevRental.PrevLandlordEmailAddress = this.origSettings.PrevLandlordEmailAddress;
    this.prevRental.PrevLandlordPhone = this.origSettings.PrevLandlordPhone;
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

  updateEmp(){
    //TODO
    this.prevRental = {
      Id: this.prevRental.Id,
      PrevLandlordEmailAddress : this.emailInput.value,
      PrevLandlordPhoneNumber : this.phoneInput.value,
      PrevLandlordPhone: this.phoneInput.value,
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
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "prevRental Saved",
            contentSummary: "This prevRental has been Saved",
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
  getInputErrorMessage(inputField){
    
    if (inputField.hasError('required')) {
      return 'You must enter a value';
    }
    if (inputField.hasError(inputField)){
        return "Not a valid entry"; 
    }
  }

  deleteBtnClicked(){
    this.dialog.open(DialogDataRRMSDialog, {
      data: {
        inError: false,
        title: "Delete - Are you sure?",
        contentSummary: "Are you sure you would like to delete this previous rental?",
        errorItems: []
      }
    }).afterClosed().subscribe((deleteEmp: boolean)=> {
      if (deleteEmp == true ){       
        this.prevRentalService.removePrevRental(this.prevRental.Id);
        this.prevRentals = Array.from(this.prevRentals).filter(prevRental => prevRental.Id != this.prevRental.Id);
        this.dialogRef.close(this.prevRentals); // this needs to return a null
      }
    });

  }
}
