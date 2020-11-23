import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IHome } from 'src/app/interfaces/Homes';
import {IEmployer, SalaryType} from '../../../interfaces/Employer';
import {IRoom} from '../../../interfaces/Rooms';
import {ProspectService} from '../../../services/prospect.service';
import { IProspect } from 'src/app/interfaces/Prospect';
import { Router } from '@angular/router';

interface AvailableRoomsAndProspects{
  availRooms: Iterable<IRoom>,
  availProspects: Iterable<IProspect>,
}
enum ProspectStatus {
  approved = 1,
  declined = 2,
  pendingLandlordDecision = 3,
  pendingLeaseSignature = 4,
  leasedSigned = 5,
  inBilling = 6,
}

@Component({
  selector: 'app-add-approved-prospect',
  templateUrl: './add-approved-prospect.component.html',
  styleUrls: ['./add-approved-prospect.component.css']
})
export class AddApprovedProspectComponentModal implements OnInit {
  room : IRoom;
  availRooms : Iterable<IRoom>;
  availProspects: Iterable<IProspect>;
  selectedRoom: number;
  selectedProspect: number;//IProspect;
  fieldsModified: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public fromParent: AvailableRoomsAndProspects,
  public dialogRef: MatDialogRef<AddApprovedProspectComponentModal>,
  private prospectService: ProspectService,
  public dialog: MatDialog, 
  private router: Router,
  ) {

  }
  ngOnInit(): void {
    this.fieldsModified == false;
    this.availRooms = this.fromParent.availRooms;
    this.availProspects = this.fromParent.availProspects;
    console.log("in init, availRooms are " + JSON.stringify(this.availRooms));
    console.log("and prospects are : " + JSON.stringify(this.availProspects));
  }
  ngOnChanges(){
    this.availRooms = this.fromParent.availRooms;
    this.availProspects = this.fromParent.availProspects;
    console.log("and prospects are : " + JSON.stringify(this.availProspects));

  }
  closeNoSelection(){
    this.dialogRef.close(null);
  }
  returnChoice(){
    console.log("before closing, room is " + (this.selectedRoom));
    
    this.dialogRef.close(null); // important: returns the id, not the index!!
  }
  showProductDetails(){
  }
  roomsExist(){
    if ((this.availRooms != null) && ((<any[]>this.availRooms).length > 0)){
      return true;
    }
    return false;
  }

  prospectsExist(){
    if ((this.availProspects != null) && ((<any[]>this.availProspects).length > 0)){
      return true;
    }
    return false;
  }

  addAppvdProsToRoom(){
    console.log("setting:" + JSON.stringify(this.selectedProspect) + " to " + this.selectedRoom);
    let myProspect : IProspect = (<IProspect[]>this.availProspects).find(pros => pros.Id == this.selectedProspect);
    myProspect.Status = ProspectStatus.pendingLeaseSignature;
    this.prospectService.updateProspect(myProspect)
    .then(() => {
      // Prompt user that the Prospect has been Linked to the Room and that the workflow is pending
      // Lease Documentation Generation and Signature by Prospect
      this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "Saved",
            contentSummary: "This home has been Saved! Would you like to proceed to add a rental room for this home?",
            errorItems: []
          }
          }).afterClosed().subscribe((addRooms: boolean)=> {
            if (addRooms == true ){
              this.router.navigate([`leases/add-lease`]);
              this.dialogRef.close();
            }
            else{
              this.dialogRef.close();
            }
          });
    }).catch((err) => {
            this.dialog.open(DialogDataRRMSDialog, {
              data: {
                inError: true,
                title: "Unable to process",
                contentSummary: "We're sorry. We are unable to process",
                errorItems: []
              }
            });
          });
  }
}
