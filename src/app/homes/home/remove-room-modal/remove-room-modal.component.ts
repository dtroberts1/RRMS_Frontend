import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
import { RoomsService } from 'src/app/services/room.service';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {HomesService} from '../../../services/homes.service';


@Component({
  selector: 'app-remove-room-modal',
  templateUrl: './remove-room-modal.component.html',
  styleUrls: ['./remove-room-modal.component.css']
})
export class RemoveRoomModalComponent implements OnInit {
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
  modalRef: MDBModalRef;

  dimension1 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  monthlyRateInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,5}')]);
  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
  selectedRoom: IRoom = null //Id of room

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<RemoveRoomModalComponent>,
  public dialog: MatDialog, 
  private roomService: RoomsService,
  private modalService: MDBModalService,

  ) {
  }
  closeNoSelection(){
    this.dialogRef.close(false);
  }
  showProductDetails(){
  }
  roomsExist(){
    if (this.home != null && this.home.Rooms != null && (<any[]>this.home.Rooms).length > 0){
      return true;
    }
    else{
      return false;
    }
  }
  
  ngOnInit(): void {
    this.home = this.data.home;
  }
  fieldChanged(home: IHome){
  }
  setOrigSettings(room : IRoom)
  {
   this.origSettings = Object.assign({}, room);
  }

  removeRoom(){
    console.log("removing room");
    // Should first check if prospects are assigned to this room, so they can be deleted if necessary
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
        this.roomService.getProspectsAssignedToRoom(this.selectedRoom.Id).then((prospects: Iterable<IProspect>) => {
        console.log("prospects from query call is " + JSON.stringify(prospects))
        if (prospects == null || (<any[]>prospects).length == 0){
          // If there are no prospects assigned, it's safe to remove the room
          this.roomService.removeRoom(this.selectedRoom.Id).then(() => {
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
                contentSummary: `Room ${this.selectedRoom.RoomName} has been Removed`,
                errorItems: []
              }
            });
            this.modalRef.content.action.subscribe(() => {
              this.modalRef.hide();
              this.dialogRef.close(true);
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
  updateRoom(){

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

