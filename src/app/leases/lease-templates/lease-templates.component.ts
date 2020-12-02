import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
    DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService
} from '@syncfusion/ej2-angular-documenteditor';

@Component({
    selector: 'app-lease-templates',
    template: `<div style="width:100%;height:330px"><button ejs-button (click)="saveAsDocx()" >Save</button>
    <ejs-documenteditorcontainer #document_editor_container_component id="container" serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/" style="width:100%;height:100%;display:block" [isReadOnly]=false [enableEditor]=true [enableWordExport]=true> </ejs-documenteditorcontainer></div>`,
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService]
})

export class LeaseTemplatesComponent {
 @ViewChild('document_editor_container_component')
 public documentEditorContainerComponent: DocumentEditorContainerComponent;
 
 public saveAsDocx() :void {
    this.documentEditorContainerComponent.documentEditor.save('sample','Docx');
 }

}