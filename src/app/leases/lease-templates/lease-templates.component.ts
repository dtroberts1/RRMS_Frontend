import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {TemplateService} from '../../services/template.service';
import {
    FormatType, DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService
} from '@syncfusion/ej2-angular-documenteditor';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { MatDialog } from '@angular/material/dialog';
import { LeaseTemplatePopupModal } from './lease-template-popup-modal/lease-template-popup-modal.component';

@Component({
    selector: 'app-container',
    templateUrl: './lease-templates.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService, TemplateService]
})

export class LeaseTemplatesComponent {
    public serverSplitBtnItems: ItemModel[] = [
        {text: 'Save'},
        {text: 'Load'},
        {text: 'Update'},
        {text: 'Delete'},
    ]
    public mergeTagsSplitBtnItems: ItemModel[] = [
        { text: 'Insert'},
        { text: 'Remove'},
        ];
        public rlaSplitBtnItems: ItemModel[] = [
            { text: 'Choose State'},
        ]
        public states: ItemModel[] = [
            { text: 'Alabama'},
            { text: 'Alaska'},
            { text: 'Arizona'},
            { text: 'Arkansas'},
            { text: 'California'},
            { text: 'Colorado'},
            { text: 'Connecticut'},
            { text: 'Delaware'},
            { text: 'Florida'},
            { text: 'Georgia'},
            { text: 'Hawaii'},
            { text: 'Idaho'},
            { text: 'Illinois'},
            { text: 'Indiana'},
            { text: 'Iowa'},
            { text: 'Kansas'},
            { text: 'Kentucky'},
            { text: 'Louisiana'},
            { text: 'Maine'},
            { text: 'Maryland'},
            { text: 'Massachusetts'},
            { text: 'Michigan'},
            { text: 'Maine'},
            { text: 'Minnesota'},
            { text: 'Mississippi'},
            { text: 'Missouri'},
            { text: 'Montana'},
            { text: 'Nebraska'},
            { text: 'Nevada'},
            { text: 'New Hampshire'},
            { text: 'Missouri'},
            { text: 'New Jersey'},
            { text: 'New Mexico'},
            { text: 'New York'},
            { text: 'North Carolina'},
            { text: 'North Dakota'},
            { text: 'Ohio'},
            { text: 'Oklahoma'},
            { text: 'Oregon'},
            { text: 'Pennsylvania'},
            { text: 'Rhode Island'},
            { text: 'South Carolina'},
            { text: 'South Dakota'},
            { text: 'Tennessee'},
            { text: 'Texas'},
            { text: 'Utah'},
            { text: 'Vermont'},
            { text: 'Virginia'},
            { text: 'Washington'},
            { text: 'West Virginia'},
            { text: 'Wisconsin'},
            { text: 'Wyoming'},
            ];
    constructor(private templateService: TemplateService,public dialog: MatDialog, 
        ){
        
    }
    @ViewChild('document_editor')
    public documentEditorContainerComponent: DocumentEditorContainerComponent;
    
    public saveAsDocx() :void {
        let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
        console.log("attempting to send over " + JSON.stringify(sfdt));
        this.dialog.open(LeaseTemplatePopupModal, {

        }).afterClosed().subscribe((selectedState: string) => {
            if (selectedState != ''){
                this.templateService.createTemplate(sfdt, selectedState);
            }
        });
    }
  
    ngOnInit(){
    console.log("in init..");
 }
rlaBtnClicked(){
    // Default is choose State
    this.dialog.open(LeaseTemplatePopupModal, {
    })
        .afterClosed().subscribe((selectedState: string) => {
            if (selectedState != ''){
                this.templateService.getStateRLATemplates(selectedState).then((sfdt : any) => {
                    this.documentEditorContainerComponent.documentEditor.open(sfdt);
                })
            }
        });
}

 rlaBtnItemSelected(args: MenuEventArgs){
     let selectedItem: string = args.item.text;
     if (selectedItem == 'Choose State'){
         this.dialog.open(LeaseTemplatePopupModal, {
          })
            .afterClosed().subscribe((selectedState: string) => {
                if (selectedState != ''){
                    this.templateService.getStateRLATemplates(selectedState).then((sfdt : any) => {
                        this.documentEditorContainerComponent.documentEditor.open(sfdt);
                    })
                }
            });
     }
 }
 serverBtnItemSelected(args: MenuEventArgs){
    let selectedItem: string = args.item.text;
    if (selectedItem == 'Save'){
        console.log(selectedItem + " has been selected");
    }
    else if(selectedItem == 'Load'){
        console.log(selectedItem + " has been selected");
    }
    else if(selectedItem == 'Update'){
        console.log(selectedItem + " has been selected");
    }
    else if(selectedItem == 'Delete'){
        console.log(selectedItem + " has been selected");
    }
 }
 mergeTagsBtnItemSelected(args: MenuEventArgs){
     let selectedItem: string = args.item.text;
     if (selectedItem == 'Insert'){
        console.log(selectedItem + " has been selected");
     }
     else if(selectedItem == 'Remove'){
        console.log(selectedItem + " has been selected");
     }
}
closeSplitBtn(){
    console.log("closing split button");
}
}