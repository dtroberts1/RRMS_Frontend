import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {RoomsService} from '../../../services/room.service';

@Component({
  selector: 'app-add-room-modal',
  templateUrl: './add-room-modal.component.html',
  styleUrls: ['./add-room-modal.component.css']
})
export class AddRoomModalComponent {
  homeImagePath : string;
  room : IRoom;
  home : IHome;
  editRate: boolean = false;
  editDimensions: boolean = false;
  editMaster: boolean = false;
  editFan: boolean = false;
  editBathroom: boolean = false;
  editCloset: boolean = false;
  fieldsModified: boolean = false;
  currentRoomIndex: number = 0;
  roomCount: number = 0;

  dimension1 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  monthlyRateInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,5}')]);
  roomNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,15}')]);
  isMaster : boolean = false;
  hasCloset : boolean = false;
  hasCeilingFan : boolean = false;
  hasPrivateBath : boolean = false;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  @Inject(MAT_DIALOG_DATA) public rooms: Iterable<IRoom>,
  public dialogRef: MatDialogRef<AddRoomModalComponent>,
  private roomsService : RoomsService,
  public dialog: MatDialog,
  ) {
    this.home = data.home;
    console.log("home input is ", JSON.stringify(this.home));
    if (this.home.Rooms != null)
    {
      this.room = data.home.Rooms[0];
      console.log("rooms is " + JSON.stringify(this.room));
    }
    else
      console.log("rooms is null in view-room: " + data.home.Rooms[this.currentRoomIndex]);
    this.roomCount = (<any[]>data.home.Rooms).length;
  }
  closeEmpDialog(){

  }  
  createRm(){
    this.inputsAreValid().then((isValid: boolean) => {
      if (isValid == true){
        console.log("about to save with HomeId = ", this.home.Id);
        this.roomsService.createRoom({
          RoomName: this.roomNameInput.value,
          Dimensions: `${this.dimension1.value} x ${this.dimension2.value}`,
          IsMaster: this.isMaster,
          HasCloset: this.hasCloset,
          HasCeilingFan: this.hasCeilingFan,
          HasPrivateBath: this.hasPrivateBath,
          MonthlyRate: this.monthlyRateInput.value,
          HomeId: this.home.Id,
          Id: -1,
        }).then(() => {
          this.dialog.open(DialogDataRRMSDialog, {
            data: {
              inError: true,
              title: "Room Created",
              contentSummary: "New Room has been created",
              errorItems: []
            }
          }).afterClosed().subscribe(result => {
            this.dialogRef.close('roomAdded');
          }),
          err=> console.log(err);
        }).catch((err) =>{
          console.log(err)
        });
      }
    });
  }
  canDispNextAndPrev(){
    if (this.roomCount > 1)
      return true;
    return false;
  }
  changeEditMode(str:string){
    switch(str) { 
      case 'rate': { 
        this.editRate = !this.editRate;
         break; 
      } 
      case 'dimensions': { 
        this.editDimensions = !this.editDimensions;
         break; 
      } 
      case 'master': { 
        this.editMaster = !this.editMaster;
        break; 
      } 
      case 'fan': { 
        this.editFan = !this.editFan;
      break; 
      } 
      case 'bathroom': { 
        this.editBathroom = !this.editBathroom;
        break; 
      } 
      case 'closet': { 
        this.editCloset = !this.editCloset;
         break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   } 
  }
  updateInput(editStr : string){
    console.log("bluring");
    switch(editStr) { 
      case 'rate': { 
        if (this.monthlyRateInput.valid == true)
        {
          this.room.MonthlyRate = this.monthlyRateInput.value;
          console.log("new rate is " + this.monthlyRateInput.value)
        }
        else{
          console.log("monthlyRateInput is not valid. it is " + this.monthlyRateInput.value);
          this.changeEditMode(editStr);
          return;
        }
         break; 
      } 
      case 'dimensions': { 
        this.editDimensions = !this.editDimensions;
         break; 
      } 
      case 'master': { 
        this.editMaster = !this.editMaster;
        break; 
      } 
      case 'fan': { 
        this.editFan = !this.editFan;
      break; 
      } 
      case 'bathroom': { 
        this.editBathroom = !this.editBathroom;
        break; 
      } 
      case 'closet': { 
        this.editCloset = !this.editCloset;
         break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
    }
      this.changeEditMode(editStr);
    this.fieldsModified = true;
    console.log("editRate is " + this.editRate);
  }
  onFileComplete(data: any) {
    this.homeImagePath = data.link;
  }

  goToNextRm(){
    this.currentRoomIndex = (this.currentRoomIndex + 1) % (<any[]>this.data.home.Rooms).length;
    this.room = this.data.home.Rooms[this.currentRoomIndex];
  }
  goToPreviousRm(){
    this.currentRoomIndex--;
    if (this.currentRoomIndex < 0){
      this.currentRoomIndex = (<any[]>this.data.home.Rooms).length - 1;
    }
    this.room = this.data.home.Rooms[this.currentRoomIndex];
  }
  closeViewRoomDialog(){
    this.dialogRef.close(null); // this needs to return a null

  }
  async inputsAreValid():Promise<boolean> {
    return new Promise((resolve, reject) => {
      let invalidElements = new Array();
      if (this.dimension1.invalid){
        invalidElements.push("Length");
      }
      if (this.dimension2.invalid){
        invalidElements.push("Width");
      }
      if (this.monthlyRateInput.invalid){
        invalidElements.push("Monthly Rate");
      }
      if (this.roomNameInput.invalid){
        invalidElements.push("Room Name");
      }

      if (invalidElements.length > 0)
      {
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: true,
            title: "Invalid Items",
            contentSummary: "The following items are invalid",
            errorItems: invalidElements
          }
        }).afterClosed().subscribe(result => {
          if (invalidElements.length > 0){
            resolve(false);
          }
          else{
            resolve(true);
          }
        });
      }else{
        resolve(true);
      }
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
}