import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {RoomsService} from '../../../services/room.service';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.css']
})
export class ViewRoomComponent {
  homeImagePath : string;
  room : IRoom;
  origSettings : IRoom;
  home : IHome;
  editRate: boolean = false;
  editDimension1: boolean = false;
  editDimension2: boolean = false;
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
  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  @Inject(MAT_DIALOG_DATA) public rooms: Iterable<IRoom>,
  public dialogRef: MatDialogRef<ViewRoomComponent>,
  private roomsService: RoomsService,
  public dialog: MatDialog, 
  ) {
    
    this.home = data.home;
    console.log("home input is ", JSON.stringify(this.home));
    if (this.home.Rooms != null)
    {
      this.setOrigSettings(this.data.home.Rooms[this.currentRoomIndex]);
      this.getSettings();
      console.log("initial dimensions:" + this.room.Dimensions);
      console.log("dim1:" + this.dimension1.value);
      console.log("dim2:" + this.dimension2.value);
      console.log("rooms is " + JSON.stringify(this.room));
    }
    else
      console.log("rooms is null in view-room: " + data.home.Rooms[this.currentRoomIndex]);
    this.roomCount = (<any[]>data.home.Rooms).length;
  }

  setOrigSettings(room : IRoom)
  {
    /*
    this.origSettings.Dimensions = room.Dimensions;
    this.origSettings.HasCloset = room.HasCeilingFan;
    this.origSettings.HasCloset = room.HasCloset;
    this.origSettings.HasPrivateBath = room.HasPrivateBath;
    this.origSettings.HomeId = room.HomeId;
    this.origSettings.Id = room.Id;
    this.origSettings.IsMaster = room.IsMaster;
    this.origSettings.MonthlyRate = room.MonthlyRate;
    this.origSettings.RoomName = room.RoomName;
    */
   this.origSettings = Object.assign({}, room);
  }
  
  closeEmpDialog(){

  }  


  addEmp(){

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
      case 'dimension1': { 
        this.editDimension1 = !this.editDimension1;
         break; 
      } 
      case 'dimension2': { 
        this.editDimension2 = !this.editDimension2;
         break; 
      } 
      case 'master': { 
        this.editMaster = !this.editMaster;
      } 
      break; 
      case 'fan': { 
        this.editFan = !this.editFan;
      } 
      break; 
      case 'bathroom': { 
        this.editBathroom = !this.editBathroom;
      } 
      break; 
      case 'closet': { 
        this.editCloset = !this.editCloset;
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
      } 
      break; 
      case 'dimension1': { 
        if (this.dimension1.valid == true && this.dimension2.valid == true)
        {
          this.room.Dimensions = `${this.dimension1.value} x ${this.dimension2.value}`;
          console.log("new rate is " + this.room.Dimensions)
        }
        else{
          console.log("dimensions input is not valid. it is " + this.room.Dimensions);
          this.changeEditMode(editStr);
          return;
        }
      } 
      break; 
      case 'dimension2': { 
        if (this.dimension1.valid == true && this.dimension2.valid == true)
        {
          this.room.Dimensions = `${this.dimension1.value} x ${this.dimension2.value}`;
          console.log("new rate is " + this.room.Dimensions)
        }
        else{
          console.log("dimensions input is not valid. it is " + this.room.Dimensions);
          this.changeEditMode(editStr);
          return;
        }
      } 
      break; 
      case 'master': { 
        this.room.IsMaster = this.isMaster;
      } 
      break;
      case 'fan': { 
        this.room.HasCeilingFan = this.hasCeilingFan;
      }
      break;  
      case 'bathroom': { 
        this.room.HasPrivateBath = this.hasPrivateBath;
      }
      break;  
      case 'closet': { 
        this.room.HasCloset = this.hasCloset;
      }
      break;  
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

  getSettings(){
    this.room = this.data.home.Rooms[this.currentRoomIndex];
    this.dimension1.setValue(this.room.Dimensions.split("x")[0].toString().trim());
    this.dimension2.setValue(this.room.Dimensions.split("x")[1].toString().trim());
    this.isMaster = this.room.IsMaster;
    this.hasCloset = this.room.HasCloset;
    this.hasCeilingFan = this.room.HasCeilingFan;
    this.hasPrivateBath = this.room.HasPrivateBath;
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
            this.updateRoom().then((saveSuccess: boolean) => {
              console.log("updating room");
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updateCurrentRoomIndex(next);
                this.getSettings();
              }
            });
          }
          else{
            console.log("not updating room");
            this.fieldsModified = false;
            console.log("original settings are " + JSON.stringify(this.origSettings));
            this.fillInputsWithOriginalSettings();
            this.updateCurrentRoomIndex(next);
            this.getSettings();
          }
        });
    }
    else{
      this.updateCurrentRoomIndex(next);
      this.getSettings();
    }
  }
  updateCurrentRoomIndex(next: boolean)
  {
    if (next == true){
      this.currentRoomIndex = (this.currentRoomIndex + 1) % (<any[]>this.data.home.Rooms).length;
    }
    else if(next == false){ // If navigating to "previous"
      this.currentRoomIndex--;
      if (this.currentRoomIndex < 0){
        this.currentRoomIndex = (<any[]>this.data.home.Rooms).length - 1;
      }
    }
  }

  closeViewRoomDialog(){
    this.dialogRef.close(null); // this needs to return a null
  }
  fillInputsWithOriginalSettings(){
    this.room.Dimensions = this.origSettings.Dimensions;
    this.room.MonthlyRate = this.origSettings.MonthlyRate;
    this.room.IsMaster = this.origSettings.IsMaster;
    this.room.HasCloset = this.origSettings.HasCloset;
    this.room.HasCeilingFan = this.origSettings.HasCeilingFan;
    this.room.HasPrivateBath = this.origSettings.HasPrivateBath;
  }
  saveBtnClickedUpdate(){
    this.updateRoom().then(() => {
        // Do nothing
    })
    .catch((err) => {
      console.log(err);
    })
  }

  updateRoom(){
    //TODO
    return new Promise((resolve, reject) => {
      console.log("about to save with HomeId = ", this.home.Id);
      this.roomsService.updateRoom({
        RoomName: this.room.RoomName,
        Dimensions: `${this.dimension1.value} x ${this.dimension2.value}`,
        IsMaster: this.isMaster,
        HasCloset: this.hasCloset,
        HasCeilingFan: this.hasCeilingFan,
        HasPrivateBath: this.hasPrivateBath,
        MonthlyRate: this.monthlyRateInput.value,
        HomeId: this.home.Id,
        Id: this.room.Id,
      }).then(() => {
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "Room Saved",
            contentSummary: "This Room has been Saved",
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
}
