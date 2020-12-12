import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {TemplateService} from '../../services/template.service';
import {
    FormatType, DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService
} from '@syncfusion/ej2-angular-documenteditor';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { MatDialog } from '@angular/material/dialog';
import { LeaseTemplatePopupModal } from './lease-template-popup-modal/lease-template-popup-modal.component';

@Component({
    selector: 'app-lease-templates',
    templateUrl: './lease-templates.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService, TemplateService]
})

export class LeaseTemplatesComponent {
    loadedFileName : string = null;
    savedNote : string = null;
    public serverSplitBtnItems: ItemModel[] = [
        {text: 'Save As'},
        {text: 'Save'},
        {text: 'Load'},
        {text: 'Delete'},
    ]
    public mergeTagsSplitBtnItems: ItemModel[] = [
        { text: 'Insert'},
        { text: 'Remove'},
        ];
        public rlaSplitBtnItems: ItemModel[] = [
            { text: 'Choose State'},
        ]
        states : Iterable<string> = [
            'Alabama',
            'Alaska',
            'Arizona',
            'Arkansas',
            'California',
            'Colorado',
            'Connecticut',
            'Delaware',
            'Florida',
            'Georgia',
            'Hawaii',
            'Idaho',
            'Illinois',
            'Indiana',
            'Iowa',
            'Kansas',
            'Kentucky',
            'Louisiana',
            'Maine',
            'Maryland',
            'Massachusetts',
            'Michigan',
            'Maine',
            'Minnesota',
            'Mississippi',
            'Missouri',
            'Montana',
            'Nebraska',
            'Nevada',
            'New Hampshire',
            'Missouri',
            'New Jersey',
            'New Mexico',
            'New York',
            'North Carolina',
            'North Dakota',
            'Ohio',
            'Oklahoma',
            'Oregon',
            'Pennsylvania',
            'Rhode Island',
            'South Carolina',
            'South Dakota',
            'Tennessee',
            'Texas',
            'Utah',
            'Vermont',
            'Virginia',
            'Washington',
            'West Virginia',
            'Wisconsin',
              'Wyoming',
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
            data: {
                title: "Residential Lease Agreement",
                contentSummary: "Chose State for RLA",
                content: this.states,
              }
        }).afterClosed().subscribe((selectedState: string) => {
            if (selectedState != null){
                this.templateService.createTemplate(sfdt, selectedState);
            }
        });
    }
  
    ngOnInit(){
        this.loadedFileName = null;
        this.savedNote = '';
    console.log("in init..");
 }
rlaBtnClicked(){
    // Default is choose State
    this.dialog.open(LeaseTemplatePopupModal, {
        data: {
            title: "Residential Lease Agreement",
            contentSummary: "Chose State for RLA",
            content: this.states,
          }
    })
        .afterClosed().subscribe((selectedState: string) => {
            if (selectedState != null){
                this.templateService.getStateRLATemplates(selectedState).then((sfdt : any) => {
                    this.documentEditorContainerComponent.documentEditor.open(sfdt);
                    this.loadedFileName = `rla_template_${selectedState}`;
                    this.savedNote = 'Not Saved';
                })
            }
        });
}

 rlaBtnItemSelected(args: MenuEventArgs){
     let selectedItem: string = args.item.text;
     if (selectedItem == 'Choose State'){
        this.dialog.open(LeaseTemplatePopupModal, {
            data: {
                title: "Residential Lease Agreement",
                contentSummary: "Chose State for RLA",
                content: this.states,
              }
        })
            .afterClosed().subscribe((selectedState: string) => {
                if (selectedState != null){
                    this.templateService.getStateRLATemplates(selectedState).then((sfdt : any) => {
                        this.documentEditorContainerComponent.documentEditor.open(sfdt);
                        this.loadedFileName = `rla_template_${selectedState}`;
                        this.savedNote = 'Not Saved';
                    })
                }
            });
     }
 }
 serverBtnItemSelected(args: MenuEventArgs){
    let selectedItem: string = args.item.text;
    if (selectedItem == 'Save As'){
        let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};

        console.log(selectedItem + " has been selected");
        this.dialog.open(LeaseTemplatePopupModal, {
            data: {
                title: "Save As",
                contentSummary: "Enter Filename (without ext)",
                content: null,
              }
        })
            .afterClosed().subscribe((fileName: string) => {
                console.log("resulting file name is " + fileName);
            if (fileName != null){
                this.templateService.createCustomTemplate(sfdt, fileName).then((sfdt : any) => {
                    // Open the confirmation dialog and update the loadedFileName and savedNote
                    this.dialog.open(LeaseTemplatePopupModal, {
                        data: {
                            title: "Saved",
                            contentSummary: `${fileName} has been saved`,
                            content: null,
                          }
                    })
                    .afterClosed().subscribe(() => {
                        this.savedNote = null;
                    })
                })
            }
        });;

    
    }
    else if(selectedItem == 'Save'){
        console.log(selectedItem + " has been selected");
        // Save file for the landlord for future use

    }
    else if(selectedItem == 'Load'){
        console.log(selectedItem + " has been selected");
        // First get list of custom filenames that exist for the landlord
        this.templateService.getAvailableCustomTemplateFileNames().then((availableFileNames: Iterable<string>) => {
            this.dialog.open(LeaseTemplatePopupModal, {
                data: {
                    title: "Load Template",
                    contentSummary: "Choose Template",
                    content: availableFileNames, // Need to set this up, also if returned list contains no elements, it should display different message
                  }
            })
                .afterClosed().subscribe((selectedState: string) => {
                    if (selectedState != null){
                        this.templateService.getTemplate(selectedState).then((sfdt : any) => {
                            this.documentEditorContainerComponent.documentEditor.open(sfdt);
                            this.loadedFileName = `${selectedState}`;
                            this.savedNote = null;
                        })
                    }
                });
        });
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