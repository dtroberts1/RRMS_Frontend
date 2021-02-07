import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {HomesService} from '../../../services/homes.service';


@Component({
  selector: 'app-link-room-modal',
  templateUrl: './link-room-modal.component.html',
  styleUrls: ['./link-room-modal.component.css']
})
export class LinkRoomModalComponent implements OnInit {
  homeImagePath : string;
  room : IRoom;
  origSettings : IRoom;
  homes : Iterable<IHome>;
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
 selected: number;
 selectedRoom: number = null;;
 action: Subject<any> = new Subject();

  constructor(
  private modalService: MDBModalService,
  ) {
  }
  closeNoSelection(){
    this.action.next(null);
  }
  returnChoice(){
    if (this.selectedRoom == null){
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
          title: "No Room Selected",
          contentSummary: "No Room has been selected. Please Select a room",
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
    }
    else{
      this.action.next(this.selectedRoom);

    }
  }
  showProductDetails(){
  }
  roomsExist(){
    if (this.homes != null){
        if (this.homes[(this.selected)] != null && this.homes[(this.selected)].Rooms != null && (<any[]>this.homes[(this.selected)].Rooms).length > 0)
          return true;
      return false;
    }
    return false;
  }
  
  ngOnInit(): void {
    // load all homes for the landlord
    if (this.homes != null)
      this.selected = this.homes[0];
  }
  fieldChanged(home: IHome){
  }
  setOrigSettings(room : IRoom)
  {
   this.origSettings = Object.assign({}, room);
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
