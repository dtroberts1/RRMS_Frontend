import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {PdfViewerComponent, LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
  ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService, AddSignatureEventArgs, PdfViewer, PdfViewerBase, Signature, ISignAnnotation, SignatureFieldSettings, HandWrittenSignatureSettings
} from '@syncfusion/ej2-angular-pdfviewer';

import { ActivatedRoute, Router } from '@angular/router';
// import the PdfViewer Module for the PDF Viewer component
import { LeaseDocumentService } from '../services/leaseDocument.service';
import { TemplateService } from '../services/template.service';
import { MatDialog } from '@angular/material/dialog';
import { LeasesPopupModal } from '../leases/leases/leases-popup-modal/leases-popup-modal.component';
import { DocumentDeliveryService } from '../services/documentDelivery.service';

@Component({
  selector: 'app-lease-document-approval',
  templateUrl: './lease-document-approval.component.html',
  styleUrls: ['./lease-document-approval.component.css'],
  providers: [LinkAnnotationService, BookmarkViewService, MagnificationService, 
    ThumbnailViewService, ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService]
})
export class LeaseDocumentApprovalComponent implements OnInit {
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

  constructor(
    private router: Router,
    private leaseDocService: LeaseDocumentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private documentDeliveryService: DocumentDeliveryService,

  ) {
    console.log("in child, confcode is " + this.leaseDocConfCode);
       // Issue is here
    //console.log("container: " +this.documentEditor.isDocumentLoaded)
   }

  ngOnInit(): void {
    if (this.route.queryParams != null){
      this.route.queryParams.subscribe(queryParams => {
        console.log("queryParams is " + JSON.stringify(queryParams))
        // do something with the query params
      });
      this.route.params.subscribe(routeParams => {
        console.log("routeParam is " + JSON.stringify(routeParams))
        if (routeParams.landlordsigned != undefined)
        {
          console.log("displaying ui");
          if (routeParams.landlordsigned == "0")
            this.landlordSigned = false;
          else if (routeParams.landlordsigned == "1")
            this.landlordSigned = true;

          this.leaseDocConfCode = routeParams.confcode;
          console.log("code is " + this.leaseDocConfCode);
          console.log("value in init is " + this.pdfViewer);
        }
      });
    }
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
    this.leaseDocService.getDocumentUsingConfCode(this.leaseDocConfCode)
      .then((sfdt : string) => {
        this.pdfViewer.load(sfdt, ''); // need to replace this with something

      })
  }

  sign(){
    this.pdfViewer.enableHandwrittenSignature = true;
    //console.log("collection: " + JSON.stringify(this.pdfviewerControl.annotations))
    
    this.pdfViewer.annotation.setAnnotationMode('HandWrittenSignature');

  }

  addedSignature(event: AddSignatureEventArgs){
      // Open Modal Dialog explaining to the users to click approve and it the Landlord will be notified!
    
    this.dialog.open(LeasesPopupModal, {
      data: {
          title: 'Ready to Send',
          contentSummary: `Signature has been applied. Click "Send Approval" to send the signed lease to Landlord.`,
          content: null,
        }
    }).afterClosed().subscribe(() => {
      this.enableSendApprvdBtn = true;
    })
  }
  saveSendApproval(){
    
    this.pdfViewer.signatureCollection.forEach((sig: ISignAnnotation) => {
      //sig.strokeColor = "#0000FF,#808080";
      this.pdfViewer.updateViewerContainer();
      

      console.log("sig: " + JSON.stringify(sig));
      this.pdfViewer.handWrittenSignatureSettings.strokeColor = "rgb(3,3,4,5)";

    })
    //this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
    /*
    if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
      colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
  }
  */
    this.pdfViewer.saveAsBlob()
      .then((blob: Blob) => {
        console.log("saving blob as " + JSON.stringify(blob));

        // Need to now pass this into Backend
        this.documentDeliveryService.sendApprovedLeaseDoc(this.leaseDocConfCode, blob, this.landlordSigned)
          .then((result) => {
            console.log("Result from delivery of approval is ");
          });
    })
  }
}
