import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {RoomsService} from '../../../services/room.service';

@Component({
  selector: 'app-add-room-modal',
  templateUrl: './add-room-modal.component.html',
  styleUrls: ['./add-room-modal.component.scss']
})
export class AddRoomModalComponent {
  action: Subject<any> = new Subject();
  modalRef: MDBModalRef;
  homeImagePath : string = '../../../assets/evan-dvorkin-TbMRBpXWPG4-unsplash.jpg'
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
  roomNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,25}')]);
  isMaster : boolean = false;
  hasCloset : boolean = false;
  hasCeilingFan : boolean = false;
  hasPrivateBath : boolean = false;

  constructor(
  private roomsService : RoomsService,
  private modalService: MDBModalService,

  ) {

  }
  closeEmpDialog(){

  }  
  ngOnInit(){
    if (this.home != null){
      if (this.home.Rooms != null)
      {
        this.room = this.home.Rooms[0];
      }
      this.roomCount = (<any[]>this.home.Rooms).length;
    }
  }
  async createRm(){
    this.inputsAreValid().then((isValid: boolean) => {
      this.room = {
        RoomName: this.roomNameInput.value,
          Dimensions: `${this.dimension1.value} x ${this.dimension2.value}`,
          IsMaster: this.isMaster,
          HasCloset: this.hasCloset,
          HasCeilingFan: this.hasCeilingFan,
          HasPrivateBath: this.hasPrivateBath,
          MonthlyRate: this.monthlyRateInput.value,
          HomeId: this.home.Id,
          RoomImages: null, //TODO
          Id: -1,
      };

      if (isValid == true){
        this.roomsService.createRoom(this.room).then((room: IRoom) => {
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
              title: "Room Created",
              contentSummary: "New Room has been created",
              errorItems: []
            }
          });
          this.modalRef.content.action.subscribe(() => {
            this.modalRef.hide();
            (<any[]>this.home.Rooms).push(room); 
            this.action.next(this.home);
          },
          error => {
            console.log(error);
            this.modalRef.hide();
          });
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
  }
  onFileComplete(data: any) {
    this.homeImagePath = data.link;
  }

  goToNextRm(){
    this.currentRoomIndex = (this.currentRoomIndex + 1) % (<any[]>this.home.Rooms).length;
    this.room = this.home.Rooms[this.currentRoomIndex];
  }
  goToPreviousRm(){
    this.currentRoomIndex--;
    if (this.currentRoomIndex < 0){
      this.currentRoomIndex = (<any[]>this.home.Rooms).length - 1;
    }
    this.room = this.home.Rooms[this.currentRoomIndex];
  }
  closeViewRoomDialog(){
    this.action.next(this.home);
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
          if (invalidElements.length > 0){
            resolve(false);
          }
          else{
            resolve(true);
          }
        },
        error => {
          console.log(error);
          this.modalRef.hide();
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
