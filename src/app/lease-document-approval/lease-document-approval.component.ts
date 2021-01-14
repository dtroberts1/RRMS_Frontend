import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormatType, DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService, ContentChangeEventArgs, DocumentChangeEventArgs, ContainerSelectionChangeEventArgs
} from '@syncfusion/ej2-angular-documenteditor';
import { LeaseDocumentService } from '../services/leaseDocument.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-lease-document-approval',
  templateUrl: './lease-document-approval.component.html',
  styleUrls: ['./lease-document-approval.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService, TemplateService]
})
export class LeaseDocumentApprovalComponent implements OnInit {
  @ViewChild('document_editor')
  // Issue is here
  public documentEditor: DocumentEditorContainerComponent;
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
    this.documentEditor.documentEditor.isReadOnly = true;
    this.documentEditor.showPropertiesPane = false;

    // Call the service to load the document in the editor
    this.leaseDocService.getDocumentUsingConfCode(this.leaseDocConfCode)
      .then((sfdt : string) => {
        this.documentEditor.documentEditor.open(sfdt);
      })
  }
}
