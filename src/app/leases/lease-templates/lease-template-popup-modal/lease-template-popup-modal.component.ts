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
  action: Subject<any> = new Subject();
  modalRef: MDBModalRef;
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
  title: string = null;
  contentSummary: string = null;
  dimension1 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  monthlyRateInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,5}')]);
  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
  selected: number;

  constructor(

  ) {

  }
  closeNoSelection(){
    this.action.next(null);
  }
  openTemplate(param: string){
    if (this.title == 'Save As')
    {
      if(this.fileName != null && this.fileName.value != '')
        this.action.next(this.fileName.value);

      else
        this.action.next(null);
    }
    else if(this.title == 'Residential Lease Agreement')
    {
      this.action.next(this.selected);
    }
    else if(this.title == 'Saved')
      this.action.next(null);
    else if(this.title == 'Load Template'){
      console.log("load template clicked");
      this.action.next(this.selected);
    }
    else if(this.title == 'Delete Template'){
      this.action.next(this.selected);
    }
    else if(this.title == 'Deleted'){
      this.action.next(null);
    }
    else if(this.title == 'Unsaved Changes'){
      this.action.next(param);
    }
    else if(this.title == 'Insert Merge Tag'){
      this.action.next(this.selected);
    }
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
