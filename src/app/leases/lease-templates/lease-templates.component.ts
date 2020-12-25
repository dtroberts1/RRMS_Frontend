import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {TemplateService} from '../../services/template.service';
import {
    FormatType, DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService, ContentChangeEventArgs
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
    astrisk: string = "";
    uiReady: boolean = false;
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
        this.uiReady = true;
        this.loadedFileName = null;
        this.savedNote = null;
        this.astrisk = null;
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
                    this.astrisk = "*";
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
                        this.astrisk = "*";
                    })
                }
            });
     }
 }
 templatesMainBtnSelected(){
    this.loadFromServer();
 }

 loadFromServer(){
       // Check and prompt if unsaved changes exist
       if (this.savedNote != null){
        this.dialog.open(LeaseTemplatePopupModal, {
            data: {
                title: "Unsaved Changes", // from 'Load Template'
                contentSummary: "Unsaved Changes exist in the editor. Would you like to save?",
                content: null, // Need to set this up, also if returned list contains no elements, it should display different message
              }
        })
            .afterClosed().subscribe(async (saveNoOrCancel: string) => {
                if (saveNoOrCancel == 'yes'){
                    // Call Save and then proceed with the block inside the "No" condition
                    // First try to save, prompt if file doesn't yet exist on server
                    
                    // There should be a loadedFileName if savedNote != null
                    await this.saveHelper(this.loadedFileName);
                    this.loadTemplateHelper();
                }
                else if(saveNoOrCancel == 'no'){
                    this.loadTemplateHelper();
                }
                else if(saveNoOrCancel == 'cancel'){
                    // Return and do nothing
                    return;
                }
            });
    }
    else{
        // If there are no un-saved changes, freely load.
        this.loadTemplateHelper();
    }
 }

 loadTemplateHelper(){
    // First get list of custom filenames that exist for the landlord
    this.templateService.getAvailableCustomTemplateFileNames().then((availableFileNames: Iterable<string>) => {
        this.dialog.open(LeaseTemplatePopupModal, {
            data: {
                title: "Load Template",
                contentSummary: "Choose Template",
                content: availableFileNames, // Need to set this up, also if returned list contains no elements, it should display different message
            }
        })
            .afterClosed().subscribe((selectedTemplate: string) => {
                if (selectedTemplate != null){
                    this.templateService.getTemplate(selectedTemplate).then((sfdt : any) => {
                        this.documentEditorContainerComponent.documentEditor.open(sfdt);
                        this.loadedFileName = `${selectedTemplate}`;
                        this.savedNote = null;
                        this.astrisk = null;
                    })
                }
            });
    });
 }

 documentChanged(args: ContentChangeEventArgs ){
     this.savedNote = 'Not Saved';
     this.astrisk = "*";
}

saveAs(selectedItem: string){
    let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};

    this.dialog.open(LeaseTemplatePopupModal, {
        data: {
            title: "Save As",
            contentSummary: "Enter Filename (without ext)",
            content: null,
          }
    })
        .afterClosed().subscribe((fileName: string) => {
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
                    this.astrisk = null;
                    this.loadedFileName = fileName;
                })
            })
        }
    });
}

async saveHelper(selectedItem : string){
    let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
    // Save file for the landlord for future use
    this.templateService.updateCustomTemplate(sfdt,this.loadedFileName).then((status: any)=>{
        if (status === 404){
            // If not found, prompt to save
            console.log("status is 404");
            this.saveAs(this.loadedFileName);
        }
        else{
            this.dialog.open(LeaseTemplatePopupModal, {
                data: {
                    title: "Saved",
                    contentSummary: `${this.loadedFileName} has been saved`,
                    content: null,
                  }
            })
            .afterClosed().subscribe(() => {
                this.savedNote = null;
                this.astrisk = null;
            })
        }
    })
}

async serverBtnItemSelected(args: MenuEventArgs){
    let selectedItem: string = args.item.text;
    if (selectedItem == 'Save As'){
        this.saveAs(selectedItem);
    }
    else if(selectedItem == 'Save'){
        await this.saveHelper(selectedItem);

    }
    else if(selectedItem == 'Load'){
        this.loadFromServer();
    }
    else if(selectedItem == 'Delete'){
        // First get list of custom filenames that exist for the landlord
        this.templateService.getAvailableCustomTemplateFileNames().then((availableFileNames: Iterable<string>) => {
            this.dialog.open(LeaseTemplatePopupModal, {
                data: {
                    title: "Delete Template", // from 'Load Template'
                    contentSummary: "Choose Template",
                    content: availableFileNames, // Need to set this up, also if returned list contains no elements, it should display different message
                  }
            })
                .afterClosed().subscribe((selectedTemplate: string) => {
                    if (selectedTemplate != null){
                        this.templateService.deleteTemplate(selectedTemplate).then(()=>{
                            this.dialog.open(LeaseTemplatePopupModal, {
                                data: {
                                    title: "Deleted",
                                    contentSummary: `${selectedTemplate} has been removed`,
                                    content: null,
                                  }
                            })
                            .afterClosed().subscribe(() => {
                                // Dont' do any thing to the content in the editor or the changed status indicators
                            })
                        })
                    }
                });
        });
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