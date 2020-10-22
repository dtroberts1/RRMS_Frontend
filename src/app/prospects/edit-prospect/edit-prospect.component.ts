import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
import {IEmployer, SalaryType} from '../../interfaces/Employer';
import {IRoom} from '../../interfaces/Rooms';
import {RoomsService} from '../../services/room.service';

@Component({
  selector: 'app-edit-prospect',
  templateUrl: './edit-prospect.component.html',
  styleUrls: ['./edit-prospect.component.css']
})
export class EditProspectComponent {
  homeImagePath : string;
  room : IRoom;
  origSettings : IProspect;
  prospects : Iterable<IProspect>;
  prospectIndex: number;
  editFName: boolean = false;
  editLName: boolean = false;
  editMdInit: boolean = false;
  editEmail: boolean = false;
  editPhoneNumber: boolean = false;
  editMoveinDate: boolean = false;
  editMoveOutDate: boolean = false;
  editDimension2: boolean = false;
  editMaster: boolean = false;
  editFan: boolean = false;
  editBathroom: boolean = false;
  editCloset: boolean = false;
  fieldsModified: boolean = false;
  currentProspectIndex: number = 0;
  prospectCount: number = 0;
  prospect : IProspect;
  dimension1 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  fNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  lNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  mdInitInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  emailInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneNumberInput = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  moveInDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  moveOutDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  @Inject(MAT_DIALOG_DATA) public rooms: Iterable<IRoom>,
  public dialogRef: MatDialogRef<EditProspectComponent>,
  private roomsService: RoomsService,
  public dialog: MatDialog, 
  ) {
    
    this.prospects = data.prospects;
    this.prospectIndex = data.prospectIndex;
    console.log("prospect input is ", JSON.stringify(this.data.prospects[this.prospectIndex]));
    if (this.prospects != null)
    {
      this.setOrigSettings(this.data.prospects[this.prospectIndex]);
      this.getSettings();
      /*
      console.log("initial dimensions:" + this.room.Dimensions);
      console.log("dim1:" + this.dimension1.value);
      console.log("dim2:" + this.dimension2.value);
      console.log("rooms is " + JSON.stringify(this.room));
      */
    }
    else
      //console.log("rooms is null in view-room: " + data.home.Rooms[this.currentProspectIndex]);
    this.prospectCount = (<any[]>data.prospects).length;
  }

  setOrigSettings(prospect : IProspect)
  {
   this.origSettings = Object.assign({}, prospect);
   console.log("in set OrigSettings, settings are " + JSON.stringify(this.origSettings ));
  }
  
  closeEmpDialog(){

  }  


  addEmp(){

  }
  canDispNextAndPrev(){
    if (this.prospectCount > 1)
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
      case 'mdinit': { 
        this.editMdInit = !this.editMdInit;
         break; 
      } 
      case 'email': { 
        this.editEmail = !this.editEmail;
      } 
      break; 
      case 'phone': { 
        this.editPhoneNumber = !this.editPhoneNumber;
      } 
      break; 
      case 'moveindate': { 
        this.editMoveinDate = !this.editMoveinDate;
      } 
      break; 
      case 'moveoutdate': { 
        this.editMoveOutDate = !this.editMoveOutDate;
      }
      break;  
      default: { 
         //statements; 
         break; 
      } 
   } 
  }
  updateInput(editStr : string){
    console.log("bluring");
    switch(editStr) { 
      case 'fname': { 
        if (this.fNameInput.valid == true)
        {
          this.prospect.FName = this.fNameInput.value;
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
          this.prospect.LName = this.lNameInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'mdinit': { 
        if (this.mdInitInput.valid == true)
        {
          this.prospect.MdInit = this.mdInitInput.value;
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
          this.prospect.EmailAddress = this.emailInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'phone': { 
        if (this.phoneNumberInput.valid == true)
        {
          this.prospect.PhoneNumber = this.phoneNumberInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'moveindate': { 
        if (this.moveInDateInput.valid == true)
        {
          this.prospect.MoveInDate = this.moveInDateInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'moveoutdate': { 
        if (this.moveOutDateInput.valid == true)
        {
          this.prospect.MoveOutDate = this.moveOutDateInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      default: { 
         //statements; 
         break; 
      } 
    }
    this.changeEditMode(editStr);
    this.fieldsModified = true;
  }
  onFileComplete(data: any) {
    //this.homeImagePath = data.link;
  }

  getSettings(){
    this.prospect = this.data.prospects[this.prospectIndex];
    this.fNameInput.setValue(this.prospect.FName);
    this.lNameInput.setValue(this.prospect.LName);
    this.mdInitInput.setValue(this.prospect.MdInit);
    this.emailInput.setValue(this.prospect.EmailAddress);
    this.phoneNumberInput.setValue(this.prospect.PhoneNumber);
    this.moveInDateInput.setValue(this.prospect.MoveInDate);
    this.moveOutDateInput.setValue(this.prospect.MoveOutDate);


    /*
    this.room = this.data.home.Rooms[this.currentProspectIndex];
    this.dimension1.setValue(this.room.Dimensions.split("x")[0].toString().trim());
    this.dimension2.setValue(this.room.Dimensions.split("x")[1].toString().trim());
    this.isMaster = this.room.IsMaster;
    this.hasCloset = this.room.HasCloset;
    this.hasCeilingFan = this.room.HasCeilingFan;
    this.hasPrivateBath = this.room.HasPrivateBath;
    */
  }

  goToNextOrPrevRm(next: boolean){
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
            this.updateProspect().then((saveSuccess: boolean) => {
              console.log("updating prospect");
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updateCurrentProspectIndex(next);
                this.getSettings();
              }
            });
          }
          else{
            console.log("not updating room");
            this.fieldsModified = false;
            console.log("original settings are " + JSON.stringify(this.origSettings));
            this.fillInputsWithOriginalSettings();
            this.updateCurrentProspectIndex(next);
            this.getSettings();
          }
        });
    }
    else{
      this.updateCurrentProspectIndex(next);
      this.getSettings();
    }
  }
  updateCurrentProspectIndex(next: boolean)
  {
    if (next == true){
      this.currentProspectIndex = (this.currentProspectIndex + 1) % (<any[]>this.data.prospects).length;
    }
    else if(next == false){ // If navigating to "previous"
      this.currentProspectIndex--;
      if (this.currentProspectIndex < 0){
        this.currentProspectIndex = (<any[]>this.data.prospects).length - 1;
      }
    }
  }

  closeViewRoomDialog(){
    this.dialogRef.close(null); // this needs to return a null
  }
  fillInputsWithOriginalSettings(){
    this.prospect.FName = this.origSettings.FName;
    this.prospect.LName = this.origSettings.LName;
    this.prospect.MdInit = this.origSettings.MdInit;
    this.prospect.EmailAddress = this.origSettings.EmailAddress;
    this.prospect.PhoneNumber = this.origSettings.PhoneNumber;
    this.prospect.MoveInDate = this.origSettings.MoveInDate;
    this.prospect.MoveOutDate = this.origSettings.MoveOutDate;

    /*
    this.room.Dimensions = this.origSettings.Dimensions;
    this.room.MonthlyRate = this.origSettings.MonthlyRate;
    this.room.IsMaster = this.origSettings.IsMaster;
    this.room.HasCloset = this.origSettings.HasCloset;
    this.room.HasCeilingFan = this.origSettings.HasCeilingFan;
    this.room.HasPrivateBath = this.origSettings.HasPrivateBath;
    */
  }
  saveBtnClickedUpdate(){
    this.updateProspect().then(() => {
        // Do nothing
    })
    .catch((err) => {
      console.log(err);
    })
  }

  updateProspect(){
    //TODO
    return new Promise((resolve, reject) => {

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
        contentSummary: "Are you sure you would like to delete this prospect?",
        errorItems: []
      }
    }).afterClosed().subscribe((deleteRoom: boolean)=> {
      /*
      if (deleteRoom == true ){
        this.roomsService.removeRoom(this.room.Id);
        this.dialogRef.close("del"); // this needs to return a null
      }
      */
    });

  }
}
