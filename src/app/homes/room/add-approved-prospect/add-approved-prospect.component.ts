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
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

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
  modalRef: MDBModalRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public fromParent: AvailableRoomsAndProspects,
  public dialogRef: MatDialogRef<AddApprovedProspectComponentModal>,
  private prospectService: ProspectService,
  public dialog: MatDialog, 
  private router: Router,
  private modalService: MDBModalService,

  ) {

  }
  ngOnInit(): void {
    this.fieldsModified == false;
    this.availRooms = this.fromParent.availRooms;
    this.availProspects = this.fromParent.availProspects;
  }
  ngOnChanges(){
    this.availRooms = this.fromParent.availRooms;
    this.availProspects = this.fromParent.availProspects;
  }
  closeNoSelection(){
    this.dialogRef.close(null);
  }
  returnChoice(){    
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
    let myProspect : IProspect = (<IProspect[]>this.availProspects).find(pros => pros.Id == this.selectedProspect);
    myProspect.Status = ProspectStatus.pendingLeaseSignature;
    this.prospectService.updateProspect(myProspect)
    .then(() => {
      // Prompt user that the Prospect has been Linked to the Room and that the workflow is pending
      // Lease Documentation Generation and Signature by Prospect
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
            title: "Prospect Saved",
            contentSummary: "This prospect has been saved! Would you like to proceed to add a lease for this prospect?",
            errorItems: []
          }
          });
          this.modalRef.content.action.subscribe((addRooms: boolean)=> {
            this.modalRef.hide();
            if (addRooms == true ){
              this.router.navigate(['./dashboard/', { outlets: { view: ['leases'] } }]);

              this.dialogRef.close();
            }
            else{
              this.dialogRef.close();
            }
          },
          error => {
            console.log(error);
            this.modalRef.hide();
          });
          }).catch((err) => {
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
                title: "Unable to process",
                contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
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
          });
  }
}
