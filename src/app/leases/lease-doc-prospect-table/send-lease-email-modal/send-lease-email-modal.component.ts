import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
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
  localFileName: string;
  fd: FormData = null;

  selectedEmailOption: string = null;
  selectedSubjectOption: string = null;
  selectedAttachmentOption: string = null;
  showEmailTextBox: boolean = false;
  showSubjectTextBox: boolean = false;
  showAttachmentBrowse: boolean = false;
  emailAddressInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  subjectLineInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9\\s\\!\\-\\*]{2,45}')]);
  emailBodyInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_\\s\\.\\!\\$\\,\\-\\%\\*\\(\\)\\?]{0,2000}')]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _http: HttpClient,
    public dialogRef: MatDialogRef<SendLeaseEmailModalComponent>,
    public dialog: MatDialog, 
    private documentDeliveryService: DocumentDeliveryService,
  ) { }

  ngOnInit(): void {
    console.log("In dto is " + JSON.stringify(this.data.docProspectDto));
    this.emailOptions = [this.data.docProspectDto.EmailAddress, 'Enter a different email'];
    this.subjectOptions = ['"Your Lease Agreement"', 'Customize Subject'];
    this.attachmentOptions = [this.data.docProspectDto.DocumentName, 'Browse local File']
    if (this.data != null){
      console.log("In modal, data is " + JSON.stringify(this.data));
    }
  }
  attachmentSelectionChanged(){
    if (this.selectedAttachmentOption == 'Browse local File'){
      this.showAttachmentBrowse = true;
    }
    else{
      this.showAttachmentBrowse = false;
      this.localFileName = null;
    }
  }
  onFileComplete(fd: FormData) {
    console.log("emailBodyInput is " + this.emailBodyInput.value);
    this.localFileName = fd.get('LocalFileName').toString();
    console.log("localFileName is " + this.localFileName);
    this.fd = fd;
  }
  localFileNameIsValid() : boolean{
    if (this.localFileName != null && this.localFileName != "")
      {
        return true;
      }
      else{
        return false;
      }
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
    if (this.localFileName != null){
      this.fd.append("Email", this.getEmail());
      this.fd.append("SubjectLine", this.getSubject());
      this.fd.append("EmailBody", this.emailBodyInput.value);
      this.fd.append("prospectId",this.data.docProspectDto.ProspectId.toString());
      this.documentDeliveryService.DeliverAddRecordCustom(this.fd)
      .then(() => {
        this.fd = null;
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "Lease Document Sent",
            contentSummary: "Lease Email has been sent to " + this.getEmail(),
            errorItems: []
          }
          }).afterClosed().subscribe(() => {
            this.dialogRef.close(true);
          })
      })
      .catch((err) => {
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: true,
            title: "Unable to process",
            contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
            errorItems: []
          }
        });
      })
    }
    else{
      console.log("sending email..");
      this.documentDeliveryService.DeliverAddRecord({
        Message: this.emailBodyInput.value,
        Subject: this.getSubject(),
        LeaseDocumentId: this.data.docProspectDto.DocumentId,
        EmailAddress: this.getEmail(),
        LocalFileData: this.localFileName,
        FName: null,
        LName: null,
        CustomFileAttachStm: null,
        EmailBody: null,
      }).then((result : number) => {
        if (result == 0){
          this.fd = null;
          this.dialog.open(DialogDataRRMSDialog, {
            data: {
              inError: false,
              title: "Lease Document Sent",
              contentSummary: "Lease Email has been sent to " + this.getEmail(),
              errorItems: []
            }
            }).afterClosed().subscribe(() => {
              this.dialogRef.close(true);
            })
          }
          else{
              this.dialog.open(DialogDataRRMSDialog, {
                data: {
                  inError: true,
                  title: "Unable to process",
                  contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
                  errorItems: []
                }
              });
          }
        })
        .catch((err) => {
          this.dialog.open(DialogDataRRMSDialog, {
            data: {
              inError: true,
              title: "Unable to process",
              contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
              errorItems: []
            }
          });
        })
    }
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
