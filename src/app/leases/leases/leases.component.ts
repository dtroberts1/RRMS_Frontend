import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {TemplateService} from '../../services/template.service';
import {
    FormatType, DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService, ContentChangeEventArgs, DocumentChangeEventArgs, ContainerSelectionChangeEventArgs
} from '@syncfusion/ej2-angular-documenteditor';
import { ClickEventArgs, ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { MatDialog } from '@angular/material/dialog';
import { LeasesPopupModal } from './leases-popup-modal/leases-popup-modal.component';
import { ProspectService } from 'src/app/services/prospect.service';
import { IProspect } from 'src/app/interfaces/Prospect';
import { LeaseDocumentService } from 'src/app/services/leaseDocument.service';
import {IDocumentProspectDto} from '../../interfaces/DocumentProspect';
import { LeaseDocProspectTableModalComponent } from '../lease-doc-prospect-table/lease-doc-prospect-table-modal/lease-doc-prospect-table-modal.component';
import { LeaseTemplatePopupModal } from '../lease-templates/lease-template-popup-modal/lease-template-popup-modal.component';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';

@Component({
    selector: 'app-leases',
    templateUrl: './leases.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService, TemplateService]
})

export class LeasesComponent {
    loadedFileName : string = null;
    savedNote : string = null;
    astrisk: string = "";
    uiReady: boolean = false;
    currentProspect: IProspect = null;
    public sendSplitBtnItems: ItemModel[] =[
      {text: 'Email'},
      {text: 'Send to'},
    ]
    public exportItems : ItemModel[] = [
        {text: 'Print'},
    ]
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
            { text: 'Choose Template'},
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
    constructor(private templateService: TemplateService,
        public dialog: MatDialog, 
        private prospectService: ProspectService,
        private leaseDocumentService: LeaseDocumentService,
        ){
        
    }
    @ViewChild('document_editor')
    public documentEditorContainerComponent: DocumentEditorContainerComponent;
    public items = ['New','Undo','Redo','Separator','Image','Table','Hyperlink','Bookmark','Comments','TableOfContents','Separator','Header','Footer','PageSetup','PageNumber','Break','Separator','Find','Separator','LocalClipboard','RestrictEditing'];

  ngOnInit(){
  this.uiReady = true;
  this.loadedFileName = null;
  this.savedNote = null;
  this.astrisk = null;
 }
rlaBtnClicked(){
    // Default is choose State
    this.dialog.open(LeasesPopupModal, {
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

testBtnClicked(){
    //this.documentEditorContainerComponent.documentEditor.editorModule.insertText("hereistext");
    //this.documentEditorContainerComponent.documentEditor.editorModule.insertField('<div>here is text</div>')
    //this worked->//console.log((Number)(this.documentEditorContainerComponent.documentEditor.editorModule.getSelectionInfo().start.split(';')[2].toString()));
    this.insertField('CompanyName');
}
insertField(fieldName) {
    let fileName : string = fieldName.replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
    console.log("fileName is " + fileName);
    var fieldCode = 'MERGEFIELD  ' + fileName + "  \\* MERGEFORMAT ";
    console.log("inserting " + fieldCode, '«' + fieldName + '»');

    this.documentEditorContainerComponent.documentEditor.editor.insertField(fieldCode, '«' + fieldName + '»');
    this.documentEditorContainerComponent.documentEditor.focusIn();
    this.documentEditorContainerComponent.documentEditor.saveAsBlob("Docx").then(function (blob) {
        console.log("blob is " + JSON.stringify(blob))
    });

}
sendMainBtnSelected(){
  console.log("Email clicked");
}
exportItemsSelected(args: MenuEventArgs){
    let selectedItem: string = args.item.text;
    if (selectedItem == "Print"){
        this.documentEditorContainerComponent.documentEditor.print();
    }
}
sendBtnItemSelected(args: MenuEventArgs){
  let selectedItem: string = args.item.text;
  if (selectedItem == 'Email'){
    console.log("Email clicked");
  }
  else if(selectedItem == 'Send to'){
    console.log("'Send to' clicked");

  }
}

 rlaBtnItemSelected(args: MenuEventArgs){
     let selectedItem: string = args.item.text;
     if (selectedItem == 'Choose Template'){
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
 }
 templatesMainBtnSelected(){
    this.loadFromServer();
 }

 loadFromServer(){
       // Check and prompt if unsaved changes exist
       if (this.savedNote != null){
        this.dialog.open(LeasesPopupModal, {
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
                    this.loadDocumentsHelper();
                }
                else if(saveNoOrCancel == 'no'){
                    this.loadDocumentsHelper();
                }
                else if(saveNoOrCancel == 'cancel'){
                    // Return and do nothing
                    return;
                }
            });
    }
    else{
        // If there are no un-saved changes, freely load.
        this.loadDocumentsHelper();
    }
 }

 loadDocumentsHelper(){
    // First get list of custom filenames that exist for the landlord
    this.leaseDocumentService.getDocumentProspectDtos().then((docProspectDtos: Iterable<IDocumentProspectDto>) => {
        console.log("back in loadDocumentsHelper, returned object is " + JSON.stringify(docProspectDtos));
        this.dialog.open(LeaseDocProspectTableModalComponent, {
            data: {
                content: docProspectDtos,
            }
        })
            .afterClosed().subscribe((retFromTable: {selectedTemplate: string, prospectId: number}) => {
                if (retFromTable != null && retFromTable.selectedTemplate != "" && retFromTable.prospectId != null){
                    // First get prospect using ID (so you can later resave)
                    this.prospectService.getProspect(retFromTable.prospectId)
                    .then((pros: IProspect) => {
                        this.currentProspect = pros;
                        this.leaseDocumentService.getDocument(retFromTable.selectedTemplate, retFromTable.prospectId).then((sfdt : any) => {
                        this.documentEditorContainerComponent.documentEditor.open(sfdt);
                        this.loadedFileName = `${retFromTable.selectedTemplate}`;
                        this.savedNote = null;
                        this.astrisk = null;
                        });
                    })
                }
            });
    });
 }
 documentChanged(args: DocumentChangeEventArgs ){
    console.log("document changed");
    // Get rid of footer
    this.documentEditorContainerComponent.element.style.height = "auto"; 
    this.documentEditorContainerComponent.documentEditor.resize(); 
 }
somethingHappend(args: Event){
    console.log("BeforeOpend");
}
exportItemsMainBtnClicked(){
    // Export Item Main button clicked
    // Open Print Dialog
    this.documentEditorContainerComponent.documentEditor.print();
}

 contentChanged(args: ContentChangeEventArgs ){
     this.savedNote = 'Not Saved';
     this.astrisk = "*";
    console.log("contentChanged");
}
contentChangeEventArgs(args: ContentChangeEventArgs){
    console.log("documentChanged");
}

containerSelectionChangedEventArgs(args: ContainerSelectionChangeEventArgs){
    console.log("containerselection changed");

}



saveAs(selectedItem: string){
    let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
    this.prospectService.getAvailableProspects().then((prospects :Iterable<IProspect>)=>{
        console.log("prospects in saveAs is " + JSON.stringify(prospects));
        this.dialog.open(LeasesPopupModal, {
            data: {
                title: "Lease - Save As",
                contentSummary: "Select Future Tenant",
                content: prospects,
              }
        })
            .afterClosed().subscribe((retVal : {prospectId: number, fileName: string}) => {
                this.prospectService.getProspect(retVal.prospectId)
                    .then((pros: IProspect) => {
                    this.currentProspect = pros;
                    this.leaseDocumentService.addDocument(sfdt, pros, retVal.fileName)
                        .then((res) => {    
                            if (res == 0){
                                this.savedNote = null;
                                this.astrisk = null;
                                this.loadedFileName = retVal.fileName;
                                this.dialog.open(LeasesPopupModal, {
                                    data: {
                                        title: "Saved",
                                        contentSummary: `${this.loadedFileName} has been saved`,
                                        content: null,
                                      }
                                })
                            }
                            else{
                                console.log("result is " + res);
                            }
                        })
                        .catch((err) => {
                            console.log("error. Unable to add document. Error is " + JSON.stringify(err));
                        })
                });
        });
    })
}

async saveHelper(selectedItem : string){
    let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
    // Save file for the landlord for future use
    console.log("In saveHelper, this.currentProspect is " + JSON.stringify(this.currentProspect));
    this.leaseDocumentService.updateDocument(sfdt,this.loadedFileName, this.currentProspect.Id).then((status: any)=>{
        if (status === 404){
            // If not found, prompt to save
            console.log("status is 404");
            this.saveAs(this.loadedFileName);
        }
        else if (status === true){
            this.dialog.open(LeasesPopupModal, {
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
        else{
            console.log("error. Response is not unsuccessful")
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
            this.dialog.open(LeasesPopupModal, {
                data: {
                    title: "Delete Template", // from 'Load Template'
                    contentSummary: "Choose Template",
                    content: availableFileNames, // Need to set this up, also if returned list contains no elements, it should display different message
                  }
            })
                .afterClosed().subscribe((selectedTemplate: string) => {
                    if (selectedTemplate != null){
                        this.templateService.deleteTemplate(selectedTemplate).then(()=>{
                            this.dialog.open(LeasesPopupModal, {
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
closeSplitBtn(){
    console.log("closing split button");
}
}