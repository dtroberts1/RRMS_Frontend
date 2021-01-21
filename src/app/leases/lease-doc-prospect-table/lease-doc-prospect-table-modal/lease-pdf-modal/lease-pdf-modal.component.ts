import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {PdfViewerComponent, LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
  ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService, AddSignatureEventArgs, PdfViewer, PdfViewerBase, Signature, ISignAnnotation, SignatureFieldSettings, HandWrittenSignatureSettings
} from '@syncfusion/ej2-angular-pdfviewer';

import { ActivatedRoute, Router } from '@angular/router';
// import the PdfViewer Module for the PDF Viewer component
import { LeaseDocumentService } from '../../../../services/leaseDocument.service';
import { TemplateService } from '../../../../services/template.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeasesPopupModal } from '../../../../leases/leases/leases-popup-modal/leases-popup-modal.component';
import { DocumentDeliveryService } from '../../../../services/documentDelivery.service';
import { IEmailedLeaseDocMessageDto } from '../../../../interfaces/EmailedLeaseDocMessageDto';

interface ModelData{
  LeaseDocId: number,
}

@Component({
  selector: 'app-lease-pdf-modal',
  templateUrl: './lease-pdf-modal.component.html',
  styleUrls: ['./lease-pdf-modal.component.css'],
  providers: [LinkAnnotationService, BookmarkViewService, MagnificationService, 
    ThumbnailViewService, ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService]
})
export class LeasePdfModalComponent implements OnInit {
  @ViewChild('myviewer')
  public pdfViewer : PdfViewerComponent;
  public service = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
     public document = 'PDF_Succinctly.pdf';
     buttonsCanEnable: boolean = false;
  // Issue is here
  public items = [];
  leaseDocConfCode: number = null;
  enableSendApprvdBtn: boolean = false;
  landlordSigned: boolean = false;
  docReady : boolean = false;

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: ModelData,
  public dialogRef: MatDialogRef<LeasePdfModalComponent>,
    private router: Router,
    private leaseDocService: LeaseDocumentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private documentDeliveryService: DocumentDeliveryService,

  ) {
    console.log("in child, confcode is " + this.leaseDocConfCode);
   }

  ngOnInit(): void {
    this.docReady = true;
  }
  onCreated(args){
    console.log("created..");
    console.log("signed is " + this.landlordSigned);
    console.log("code is " + this.leaseDocConfCode);
    console.log("value in init is " + this.pdfViewer);

    this.buttonsCanEnable = true;
    // Make the editor read only and remove properties pane
    this.pdfViewer.enableHandwrittenSignature = true;
    this.pdfViewer.handWrittenSignatureSettings.strokeColor = "rgb(3,3,4,4)";
    this.pdfViewer.handWrittenSignatureSettings.opacity = 1;
    // Call the service to load the document in the editor
    if (this.data != null && this.data.LeaseDocId != null){
      this.leaseDocService.GetLeaseDocPDFBase64(this.data.LeaseDocId)
      .then((sfdt : string) => {
        this.pdfViewer.load(sfdt, ''); // need to replace this with something

      })
    }
  }

  sign(){
    this.pdfViewer.enableHandwrittenSignature = true;
    //console.log("collection: " + JSON.stringify(this.pdfviewerControl.annotations))
    
    this.pdfViewer.annotation.setAnnotationMode('HandWrittenSignature');

  }

  close(){
    this.pdfViewer = null;
    this.docReady = false;
    this.dialogRef.close(null);
  }

  addedSignature(event: AddSignatureEventArgs){
      // Open Modal Dialog explaining to the users to click approve and it the Landlord will be notified!
    
    this.dialog.open(LeasesPopupModal, {
      data: {
          title: 'Ready to Send',
          contentSummary: `Signature has been applied. Click "Submit Approval" to send the signed lease to ${this.sendTo()}.`,
          content: null,
        }
    }).afterClosed().subscribe(() => {
      this.enableSendApprvdBtn = true;
    })
  }

  declineLease(){
    this.dialog.open(LeasePdfModalComponent, {
      data: {
          confCode: this.leaseDocConfCode,
        }
    }).afterClosed().subscribe(() => {
      this.enableSendApprvdBtn = true;
    })
  }

  sendTo(){
    if (this.landlordSigned == true)
    {
      return "tenant";
    }
    else{
      return "landlord";
    }
  }

  saveSendApproval(){
    
    this.pdfViewer.signatureCollection.forEach((sig: ISignAnnotation) => {
      //sig.strokeColor = "#0000FF,#808080";
      this.pdfViewer.updateViewerContainer();
      

      console.log("sig: " + JSON.stringify(sig));
      this.pdfViewer.handWrittenSignatureSettings.strokeColor = "rgb(3,3,4,5)";

    })

    this.pdfViewer.saveAsBlob()
      .then((blob: Blob) => {
        // Need to now pass this into Backend
        this.documentDeliveryService.sendApprovedLeaseDoc(this.leaseDocConfCode, blob, this.landlordSigned)
          .then((emailLeaseDocMessageDto: IEmailedLeaseDocMessageDto) => {
            if (emailLeaseDocMessageDto.FName != null){
              this.dialog.open(LeasesPopupModal, {
                data: {
                    title: 'Approval Submitted', // Landlord's approval
                    contentSummary: `Approval has been submitted. ${emailLeaseDocMessageDto.FName} will be notified at ${emailLeaseDocMessageDto.EmailAddress}`,
                    content: null,
                  }
              }).afterClosed().subscribe(() => {
                this.router.navigate(['']);
              })
            }
            else{
              this.dialog.open(LeasesPopupModal, {
                data: {
                    title: 'Approval Submitted', // Landlord's approval
                    contentSummary: `Approval has been submitted.`,
                    content: null,
                  }
              }).afterClosed().subscribe(() => {
                this.router.navigate(['']);

              })
            }
          });
    })
  }
}
