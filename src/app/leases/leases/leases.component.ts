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
import { SendLeaseEmailModalComponent } from '../lease-doc-prospect-table/send-lease-email-modal/send-lease-email-modal.component';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { stringify } from '@angular/compiler/src/util';

@Component({
    selector: 'app-leases',
    templateUrl: './leases.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, EditorService, SelectionService, SfdtExportService,WordExportService, TemplateService]
})

export class LeasesComponent {
    loadedFileName : string = null;
    loadedDocumentId: number = null;
    savedNote : string = null;
    astrisk: string = "";
    uiReady: boolean = false;
    currentProspect: IProspect = null;
    public sendSplitBtnItems: ItemModel[] =[
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
 templatesBtnItemSelected(args: MenuEventArgs){
    let selectedItem: string = args.item.text;
    if (selectedItem == 'Choose Template'){
        this.templatesHelperWithUnsavedPrompt();
    }
}
templatesHelperWithUnsavedPrompt(){
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
                await this.saveHelper().then(() => {
                    this.loadTemplateHelper();
                })
            }
            else if(saveNoOrCancel == 'no'){
                this.loadTemplateHelper();
            }
            else if(saveNoOrCancel == 'cance'){
                return;
            }
        });
    }
    else{
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
                        this.loadedFileName = null;
                        this.savedNote = "Not Saved";
                        this.astrisk = null;
                    })
                }
            });
    });
}
templatesMainBtnClicked(){
    this.templatesHelperWithUnsavedPrompt();
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
    this.emailHelper();
}
exportItemsSelected(args: MenuEventArgs){
    let selectedItem: string = args.item.text;
    if (selectedItem == "Print"){
        this.documentEditorContainerComponent.documentEditor.print();
    }
}
sendBtnItemSelected(args: MenuEventArgs){
  let selectedItem: string = args.item.text;
  if(selectedItem == 'Send to'){
    this.emailHelper();
  }
}
emailHelper(){
    let dtoData = {
        DocumentName : this.loadedFileName,
        EmailAddress : this.currentProspect.EmailAddress,
        FName : this.currentProspect.FName,
        LName : this.currentProspect.LName,
        MdInit : this.currentProspect.MdInit,
        PhoneNumber : this.currentProspect.PhoneNumber,
        SSN: this.currentProspect.SSN,
        Status: this.currentProspect.Status,
        CompletedBackgroundCheck: null,
        ProspectId: this.currentProspect.Id,
        DocumentId: this.loadedDocumentId,
        Signed: null,
        HomeName: null,
        RoomName: null,
        MoveInDate: null,
        MoveOutDate: null,
        TermType: null,
        LatestDocDelivery: null,
    }
    console.log("Attempting to send" + JSON.stringify(dtoData))
    this.dialog.open(SendLeaseEmailModalComponent,{
        data: {docProspectDto: dtoData,
        }}
        ).afterClosed().subscribe((emailSent: boolean) => {
        })
}

 leasesMainBtnSelected(){
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
                await this.saveHelper();
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
        .afterClosed().subscribe((retFromTable: {selectedTemplate: string, prospectId: number, selectedDocId: number}) => {
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
                        this.loadedDocumentId = retFromTable.selectedDocId;
                    });
                })
            }
        });
    });
 }
 documentChanged(args: DocumentChangeEventArgs ){
    if (this.documentEditorContainerComponent.documentEditor.documentStart.paragraph == 
        this.documentEditorContainerComponent.documentEditor.documentEnd.paragraph &&
        this.documentEditorContainerComponent.documentEditor.documentEnd.paragraph.getLength() == 0
        )
        {
            // This should mean that the "New" button was clicked, clearing out the text with empty doc
            console.log("Content Length is Zero");
            this.savedNote = null;
            this.astrisk = "";
            this.loadedFileName = null;
        }  
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
    if (this.documentEditorContainerComponent.documentEditor.documentStart.paragraph == 
        this.documentEditorContainerComponent.documentEditor.documentEnd.paragraph &&
        this.documentEditorContainerComponent.documentEditor.documentEnd.paragraph.getLength() == 0
        )
        {
            console.log("Content Length is Zero");
        }  
    else{
        console.log("in else, length is " + this.documentEditorContainerComponent.documentEditor.documentEnd.paragraph.getLength())
    }
}

containerSelectionChangedEventArgs(args: ContainerSelectionChangeEventArgs){
    console.log("containerselection changed");

}



saveAs(selectedItem: string){
    return new Promise((resolve, reject) => {
        let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
        this.prospectService.getAvailableProspects().then((prospects :Iterable<IProspect>)=>{
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
                            .then((documentId: number) => {    
                                if (documentId != null){
                                    this.loadedDocumentId = documentId;
                                    this.savedNote = null;
                                    this.astrisk = null;
                                    this.loadedFileName = retVal.fileName;
                                    this.dialog.open(LeasesPopupModal, {
                                        data: {
                                            title: "Saved",
                                            contentSummary: `${this.loadedFileName} has been saved`,
                                            content: null,
                                          }
                                    }).afterClosed().subscribe(() => {
                                        resolve(true);
                                    })
                                }
                                else{
                                    console.log("result is " + documentId);
                                    reject();
                                }
                            })
                            .catch((err) => {
                                console.log("error. Unable to add document. Error is " + JSON.stringify(err));
                                reject();
                            })
                    });
            });
        })
    })
}

async saveHelper(){
    return new Promise((resolve, reject) => {
        let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
        // Save file for the landlord for future use
        console.log("In saveHelper, this.currentProspect is " + JSON.stringify(this.currentProspect));
        // If trying to save (not clicking save as), the prospect won't be linked, so check for prospect first
        if (this.currentProspect != null){
            this.leaseDocumentService.updateDocument(sfdt,this.loadedFileName, this.currentProspect.Id).then((status: any)=>{
                if (status === 404){
                    // If not found, prompt to save
                    console.log("status is 404");
                    this.saveAs(this.loadedFileName).then(() => {
                        resolve(true);
                    })
                    .catch(() => {
                        reject();
                    });

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
                        resolve(true);
                    })
                }
                else{
                    console.log("error. Response is not unsuccessful")
                    reject();
                }
            })
        }
        else{
            this.saveAs(this.loadedFileName).then(() => {
                resolve(true);
            })
            .catch(() => {
                reject();
            });
        }
    });
}

async leasesBtnItemSelected(args: MenuEventArgs){
    let selectedItem: string = args.item.text;
    if (selectedItem == 'Save As'){
        this.saveAs(selectedItem);
    }
    else if(selectedItem == 'Save'){
        await this.saveHelper();

    }
    else if(selectedItem == 'Load'){
        this.loadFromServer();
    }
    else if(selectedItem == 'Delete'){
        // First get list of custom filenames that exist for the landlord
        this.leaseDocumentService.getDocumentProspectDtos().then((leaseDocDtos: Iterable<IDocumentProspectDto>) => {
            this.dialog.open(LeasesPopupModal, {
                data: {
                    title: "Delete Lease Document", // from 'Load Template'
                    contentSummary: "Choose Lease Document",
                    content: leaseDocDtos, // Need to set this up, also if returned list contains no elements, it should display different message
                  }
            })
                .afterClosed().subscribe((leaseDocDto: IDocumentProspectDto) => {
                    console.log("Back in leases, selected result is " + JSON.stringify(leaseDocDto));
                    if (leaseDocDto != null){
                        this.dialog.open(DialogDataRRMSDialog, {
                            data: {
                              inError: false,
                              title: "Delete - Are you sure?",
                              contentSummary: `Are you sure you would like to delete this template "${leaseDocDto.DocumentName}"?`,
                              errorItems: []
                            }
                          }).afterClosed().subscribe((deleteLease: boolean)=> {
                              if (deleteLease == true){
                                this.leaseDocumentService.removeLeaseDocument(leaseDocDto.DocumentId).then(()=>{
                                    this.dialog.open(LeasesPopupModal, {
                                        data: {
                                            title: "Deleted",
                                            contentSummary: `${leaseDocDto.DocumentName} has been removed`,
                                            content: null,
                                          }
                                    })
                                    .afterClosed().subscribe(() => {
                                        // Dont' do any thing to the content in the editor or the changed status indicators
                                    })
                                })
                              }
                            });
                        }
                    });
        });
    }
 }
closeSplitBtn(){
    console.log("closing split button");
}
}