import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
    DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService
} from '@syncfusion/ej2-angular-documenteditor';

@Component({
    selector: 'app-container',
    template: `<button ejs-button (click)="saveAsDocx()" >Save</button>
    <ejs-documenteditorcontainer #document_editor  id="container" serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/" [isReadOnly]=false [enableEditor]=true [enableWordExport]=true> </ejs-documenteditorcontainer>`,
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService]
})

export class LeaseTemplatesComponent {
 @ViewChild('document_editor')
 public documentEditorContainerComponent: DocumentEditorContainerComponent;
 
 public saveAsDocx() :void {
    this.documentEditorContainerComponent.documentEditor.save('sample','Docx');
 }

}