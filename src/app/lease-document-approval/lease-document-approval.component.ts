import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {PdfViewerComponent, LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
  ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService,LoadEventArgs
} from '@syncfusion/ej2-angular-pdfviewer';

import { ActivatedRoute, Router } from '@angular/router';
// import the PdfViewer Module for the PDF Viewer component
import { LeaseDocumentService } from '../services/leaseDocument.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-lease-document-approval',
  templateUrl: './lease-document-approval.component.html',
  styleUrls: ['./lease-document-approval.component.css'],
  providers: [LinkAnnotationService, BookmarkViewService, MagnificationService, 
    ThumbnailViewService, ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService]
})
export class LeaseDocumentApprovalComponent implements OnInit {
  public pdfviewerControl : PdfViewerComponent;
  public service = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
     public document = 'PDF Succinctly.pdf';

  // Issue is here
  public items = [];
  leaseDocConfCode: number = null;;

  constructor(
    private router: Router,
    private leaseDocService: LeaseDocumentService,
    private route: ActivatedRoute,

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
        if (routeParams.id != undefined)
        {
          console.log("displaying ui");
          this.leaseDocConfCode = routeParams.id;
          console.log("code is " + this.leaseDocConfCode);
        }
      });
    }
  }
  onCreated(){
    console.log("created..");
    // Make the editor read only and remove properties pane

    // Call the service to load the document in the editor
    this.leaseDocService.getDocumentUsingConfCode(this.leaseDocConfCode)
      .then((sfdt : string) => {
        //this.pdfviewerControl.load(sfdt); // need to replace this with something

      })
  }
}
