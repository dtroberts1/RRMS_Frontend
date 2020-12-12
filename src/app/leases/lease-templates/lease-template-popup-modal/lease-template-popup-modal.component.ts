import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {HomesService} from '../../../services/homes.service';

export interface DialogData {
  title: string,
  contentSummary: string,
}

@Component({
  selector: 'lease-template-popup-modal',
  templateUrl: './lease-template-popup-modal.component.html',
  styleUrls: ['./lease-template-popup-modal.component.css']
})
export class LeaseTemplatePopupModal implements OnInit {
  homeImagePath : string;
  room : IRoom;
  fileName : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  origSettings : IRoom;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  public dialogRef: MatDialogRef<LeaseTemplatePopupModal>,
  public dialog: MatDialog, 
  ) {
    if (data != null){
      
    }
  }
  closeNoSelection(){
    this.dialogRef.close(null);
  }
  openTemplate(){
    if (this.data.title == 'Save As')
    {
      if(this.fileName != null && this.fileName.value != '')
        this.dialogRef.close(this.fileName.value);
      else
        this.dialogRef.close(null);
    }
    else if(this.data.title == 'Residential Lease Agreement')
    {
        this.dialogRef.close(this.selected);
    }
    else if(this.data.title == 'Saved')
      this.dialogRef.close(null);
    else if(this.data.title == 'Load Template'){
      this.dialogRef.close(this.selected)
    }
    //this.dialogRef.close(this.selected); // important: returns the id, not the index!!
  }
  showProductDetails(){
  }

  getFNameErrorMessage(){
    if (this.fileName.hasError('fileName')) {
      return 'You must enter a value';
    }
  }
  
  ngOnInit(): void {

  }
  fieldChanged(home: IHome){
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