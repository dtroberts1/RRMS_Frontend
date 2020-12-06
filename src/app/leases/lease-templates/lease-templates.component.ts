import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {TemplateService} from '../../services/template.service';
import {
    FormatType, DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService
} from '@syncfusion/ej2-angular-documenteditor';

@Component({
    selector: 'app-container',
    template: `<button ejs-button (click)="saveAsDocx()" >Save</button>
    <ejs-documenteditorcontainer #document_editor  id="container" serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/" [isReadOnly]=false [enableEditor]=true [enableWordExport]=true [enableSfdtExport]=true> </ejs-documenteditorcontainer>`,
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService, TemplateService]
})

export class LeaseTemplatesComponent {
    constructor(private templateService: TemplateService){
        
    }
    @ViewChild('document_editor')
    public documentEditorContainerComponent: DocumentEditorContainerComponent;
    
    public saveAsDocx() :void {
        let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
        console.log("attempting to send over " + JSON.stringify(sfdt));
        this.templateService.createTemplate(sfdt);
    }
    /*
    public saveAsBlob() :void {
        this.documentEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        // The blob can be processed further
    });
    */
    ngOnInit(){
        console.log("in init..");
        this.templateService.getTemplate('srla_fl_initialtemp.docx').then((loadedTemplate : string) => {
            console.log("after service call, value is " + JSON.stringify(loadedTemplate));
            this.documentEditorContainerComponent.documentEditor.open(loadedTemplate)
        })

 }

}