import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {RoomsService} from '../../../services/room.service';
import {HomesService} from '../../../services/homes.service';


@Component({
  selector: 'app-add-approved-prospect',
  templateUrl: './add-approved-prospect.component.html',
  styleUrls: ['./add-approved-prospect.component.css']
})
export class AddApprovedProspectComponentModal implements OnInit {
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

  dimension1 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  monthlyRateInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,5}')]);
  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
 selected: number;
 selectedRoom: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddApprovedProspectComponentModal>,
  private roomsService: RoomsService,
  public dialog: MatDialog, 
  ) {
  }
  closeNoSelection(){
    this.dialogRef.close(null);
  }
  returnChoice(){
    console.log("before closing, room is " + (this.selectedRoom));
    this.dialogRef.close(this.selectedRoom); // important: returns the id, not the index!!
  }
  showProductDetails(){
    console.log("Details are " + this.selectedRoom);
  }
  roomsExist(){
    if (this.homes[(this.selected - 1)] != null && this.homes[(this.selected - 1)].Rooms != null && (<any[]>this.homes[(this.selected - 1)].Rooms).length > 0)
      return true;
    return false;
  }
  
  ngOnInit(): void {
    // load all homes for the landlord
    this.homes = this.data.homes;

    if (this.homes != null)
      this.selected = this.homes[0];
  }
  fieldChanged(home: IHome){
    console.log("field changed to " + JSON.stringify(home));
  }
  setOrigSettings(room : IRoom)
  {
   this.origSettings = Object.assign({}, room);
  }

  linkRoomToProspect(){

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
