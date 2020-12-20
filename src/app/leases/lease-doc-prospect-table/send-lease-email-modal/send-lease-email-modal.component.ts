import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentProspectDto } from 'src/app/interfaces/DocumentProspect';
import { DocumentDeliveryService } from 'src/app/services/documentDelivery.service';

export interface DialogData {
  docProspectDto: IDocumentProspectDto,
}
@Component({
  selector: 'app-send-lease-email-modal',
  templateUrl: './send-lease-email-modal.component.html',
  styleUrls: ['./send-lease-email-modal.component.css']
})
export class SendLeaseEmailModalComponent implements OnInit {
  emailOptions: Iterable<string>;
  subjectOptions: Iterable<string>;
  attachmentOptions: Iterable<string>;

  selectedEmailOption: string = null;
  selectedSubjectOption: string = null;
  selectedAttachmentOption: string = null;
  showEmailTextBox: boolean = false;
  showSubjectTextBox: boolean = false;
  showAttachmentBrowse: boolean = false;
  emailAddressInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  subjectLineInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9\\s\\!\\-\\*]{2,45}')]);
  emailBodyInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_\\s\\.\\!\\$\\,\\-\\%\\*\\(\\)\\?]{2,2000}')]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SendLeaseEmailModalComponent>,
    public dialog: MatDialog, 
    private documentDeliveryService: DocumentDeliveryService,
  ) { }

  ngOnInit(): void {
    console.log("In dto is " + JSON.stringify(this.data.docProspectDto));
    this.emailOptions = [this.data.docProspectDto.EmailAddress, 'Enter a different email'];
    this.subjectOptions = ['"Your Lease Agreement"', 'Customize Subject'];
    this.attachmentOptions = [this.data.docProspectDto.DocumentName, 'Browse local File']

  }
  attachmentSelectionChanged(){
    if (this.selectedAttachmentOption == 'Browse local File'){
      this.showAttachmentBrowse = true;
    }
    else{
      this.showAttachmentBrowse = false;
    }
  }
    onFileComplete(data: any) {
      console.log("attachment data is " + JSON.stringify(data))
  }

  getSubject(){
    // Used for API call -- based on what user chooses from combobox
    if (this.showSubjectTextBox == false){
      return this.subjectOptions[0]; // Default: 'Your Lease Agreement'
    }
    else if (this.showSubjectTextBox == true){
      return this.subjectLineInput.value;
    }
  }
  getEmail(){
    // Used for API call -- based on what user chooses from combobox
    if (this.showEmailTextBox == false){
      return this.emailOptions[0]; // Default: should be this.data.docProspectDto.EmailAddress
    }
    else if(this.showEmailTextBox == true){
      return this.emailAddressInput.value;
    }
  }

  sendEmail(){
    console.log("sending email..");
    this.documentDeliveryService.DeliverAddRecord({
      message: this.emailBodyInput.value,
      subject: this.getSubject(),
      leaseDocumentId: this.data.docProspectDto.DocumentId,
      emailAddress: this.getEmail(),
    }).then((result : number) => {
      if (result == 0){
        // Result is Ok
        console.log("result is ok, closing dialog with true");
        this.dialogRef.close(true); // Should actually open a modal saying it's been sent
      }
      else{
        console.log("result is error");
        // Should actually open a modal saying it's been sent
      }
    })
  }
  cancel(){
    this.dialogRef.close(null);
  }
  clearText(){
    this.emailBodyInput.reset();
  }
  subjectSelectionChanged(){
    if (this.selectedSubjectOption == 'Customize Subject'){
      this.showSubjectTextBox = true;
    }
    else{
      this.showSubjectTextBox = false;
    }
  }
  selectionChanged(){
    if (this.selectedEmailOption == 'Enter a different email'){
      this.showEmailTextBox = true;
    }
    else{
      this.showEmailTextBox = false;
    }
  }
  getErrorMessage(inputField: AbstractControl){
    if (this.emailAddressInput.hasError(inputField.value)) {
      return 'Value is invalid';
    }
    if (this.subjectLineInput.hasError(inputField.value)){
      return 'Value is invalid';
    }
    if (this.emailBodyInput.hasError(inputField.value)){
      return 'Email Body is invalid';
    }
  }
}
