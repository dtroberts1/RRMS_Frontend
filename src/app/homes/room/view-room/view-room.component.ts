import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
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
  modalRef: MDBModalRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  @Inject(MAT_DIALOG_DATA) public rooms: Iterable<IRoom>,
  public dialogRef: MatDialogRef<ViewRoomComponent>,
  private roomsService: RoomsService,
  public dialog: MatDialog, 
  private modalService: MDBModalService,

  ) {
    
    this.home = data.home;
    if (this.home != null){
      if (this.home.Rooms != null)
      {
        this.setOrigSettings(this.data.home.Rooms[this.currentRoomIndex]);
        this.getSettings();
        console.log('this.data.home.Rooms = ' + JSON.stringify(this.data.home.Rooms))
      }
      this.roomCount = (<any[]>data.home.Rooms).length;
    }
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
    switch(editStr) { 
      case 'rate': { 
        if (this.monthlyRateInput.valid == true)
        {
          this.room.MonthlyRate = this.monthlyRateInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        }
      } 
      break; 
      case 'dimension1': { 
        if (this.dimension1.valid == true && this.dimension2.valid == true)
        {
          this.room.Dimensions = `${this.dimension1.value} x ${this.dimension2.value}`;
        }
        else{
          this.changeEditMode(editStr);
          return;
        }
      } 
      break; 
      case 'dimension2': { 
        if (this.dimension1.valid == true && this.dimension2.valid == true)
        {
          this.room.Dimensions = `${this.dimension1.value} x ${this.dimension2.value}`;
        }
        else{
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
          if (choosesSave == true){
            this.updateRoom().then((saveSuccess: boolean) => {
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updateCurrentRoomIndex(next);
                this.getSettings();
                this.modalRef.hide();
              }
            });
          }
          else{
            this.fieldsModified = false;
            this.updateCurrentRoomIndex(next);
            this.getSettings();
            this.modalRef.hide();
          }
        },
        error => {
          console.log(error);
          this.modalRef.hide();
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
    this.dialogRef.close(this.home); // this needs to return a null
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
    if (this.room != null){
      let monthlyRate = (this.monthlyRateInput.value != null ? this.monthlyRateInput.value : this.room.MonthlyRate);
      console.log("before saving, monthly rate input is " + this.monthlyRateInput.value);
        this.room = {
          RoomName: this.room.RoomName,
          Dimensions: `${this.dimension1.value} x ${this.dimension2.value}`,
          IsMaster: this.isMaster,
          HasCloset: this.hasCloset,
          HasCeilingFan: this.hasCeilingFan,
          HasPrivateBath: this.hasPrivateBath,
          MonthlyRate: this.room.MonthlyRate,
          HomeId: this.home.Id,
          Id: this.room.Id,
        };
        return new Promise((resolve, reject) => {
        this.roomsService.updateRoom(this.room).then(() => {
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
              title: "Room Saved",
              contentSummary: "This Room has been Saved",
              errorItems: []
            }
            });
            this.modalRef.content.action.subscribe((addRooms: boolean)=> {
              this.fieldsModified = false;
              this.modalRef.hide();
              resolve(true);
            },
            error => {
              console.log(error);
              this.modalRef.hide();
            });
        }).catch((err) => {
          console.log(err);
          reject(false);
        });
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
        contentSummary: "Are you sure you would like to delete this room?",
        errorItems: []
      }
    });
    this.modalRef.content.action.subscribe((deleteRoom: boolean)=> {
      this.modalRef.hide();

      if (deleteRoom == true ){
        console.log("removing room");
        // Should first check if prospects are assigned to this room, so they can be deleted if necessary
        this.roomsService.getProspectsAssignedToRoom(this.room.Id).then((prospects: Iterable<IProspect>) => {
          console.log("prospects from query call is " + JSON.stringify(prospects))
          if (prospects == null || (<any[]>prospects).length == 0){
            // If there are no prospects assigned, it's safe to remove the room
            this.roomsService.removeRoom(this.room.Id).then(() => {
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
                  title: "Room Deleted",
                  contentSummary: `Room ${this.room.RoomName} has been Removed`,
                  errorItems: []
                }
              });
              this.modalRef.content.action.subscribe(() => {
                this.home.Rooms = this.rooms;
                this.modalRef.hide();
                this.dialogRef.close(this.home); // this needs to return a null
              },
              error => {
                console.log(error);
                this.modalRef.hide();
              });
          })
            .catch((err) =>{
              console.log("error on removal: " + err);
            })
          }
          else{
            let stringItems : string[] = new Array<string>();
            Array.from(prospects).forEach(item => {
              stringItems.push(item.FName + " " + item.LName);
            })
            console.log("Before opening error dialog, stringItems is " + JSON.stringify(stringItems))
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
                title: "Unable To Delete",
                contentSummary: `The following prospects are linked to this room and will need to be either removed or linked to a different room:`,
                errorItems: stringItems,
              }
            });
            this.modalRef.content.action.subscribe(()=> {
              this.modalRef.hide();
            },
            error => {
              console.log(error);
              this.modalRef.hide();
            });
          }
        })
      }
    },
    error => {
      console.log(error);
      this.modalRef.hide();
    });
  }
}
