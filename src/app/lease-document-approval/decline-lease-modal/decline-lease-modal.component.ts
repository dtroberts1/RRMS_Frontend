import { ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { DocumentDeliveryService } from 'src/app/services/documentDelivery.service';

@Component({
  selector: 'app-decline-lease-modal',
  templateUrl: './decline-lease-modal.component.html',
  styleUrls: ['./decline-lease-modal.component.css']
})
export class DeclineLeaseModalComponent implements OnInit {
  declineReasonInput = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,100}')]);
  modalRef: MDBModalRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {confCode: number}, 
  public dialogRef: MatDialogRef<DeclineLeaseModalComponent>,
  private docDeliveryService: DocumentDeliveryService,
  public dialog: MatDialog, 
  private modalService: MDBModalService,

  ) { 

  }

  ngOnInit(): void {
    console.log("In declined modal init, confCode is "+  this.data.confCode);
  }
  getErrorMessage(inputField: AbstractControl){

    if (this.declineReasonInput.hasError(inputField.value)){
      return 'Text is invalid';
    }
  }
  submitReason(){
    this.docDeliveryService.DeclineWithReason(this.data.confCode, "here is the reason for decline")
      .then((res) => {
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
            title: "Decline Submitted",
            contentSummary: "Thanks for submitting the reason for declining the lease. The landlord will be notified",
          }
        });
        this.modalRef.content.action.subscribe(() => {
          this.modalRef.hide();
          this.dialogRef.close(null);
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
      })
  }
}
