import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {TemplateService} from '../../services/template.service';
import {
    FormatType, DocumentEditorComponent, DocumentEditorContainerComponent, EditorService, SelectionService, SfdtExportService, ToolbarService, WordExportService, ContentChangeEventArgs, PositionInfo, CustomToolbarItemModel, DocumentChangeEventArgs
} from '@syncfusion/ej2-angular-documenteditor';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { MatDialog } from '@angular/material/dialog';
import { LeaseTemplatePopupModal } from './lease-template-popup-modal/lease-template-popup-modal.component';
import { rejects } from 'assert';

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
        ];
        public rlaSplitBtnItems: ItemModel[] = [
            { text: 'Choose State'},
        ]
        mergeTagKeys : Iterable<string> = [
            'DateToday',
            'LandlordName',
            'LandlordMailingAddress',
            'TenantNames',
            'LeaseStartDate',
            'LeaseEndDate',
            //eformsToRRMSMap.Add("[#]", "MonthToMonthEndDateNotice");
            'OtherResidenceType', // Other residence type that is not a house, apartment, or condo
            'OtherUsesForPremise',// Other uses of premise besides "Residential Dwelling"
            'OccupantNames', // Not including tenant
            'LandlordName',
            'NumberOfBedRooms',
            'NumberOfBathRooms',
            'PremiseFurnishings',
            'PremiseAppliances',
            'MonthlyRate',
            'RentPaymentInstructions',
            'NSFFee',
            'LateFee',
            'PrepayRentAmount',
            'PrepayRentAmount',
            'LeaseStartDate',
            'LeaseEndDate',
            'ProrationAmount',
            'ProrationAmount',
            'SecurityDepositAmount',
            'ParkingFee',
            'ParkingSpacesDescription',
            'UtilitiesProvided',
            'EarlyTerminationFee',
            'SmokingAreas',
            'AcceptableTypesOfPets',
            'MaxPetWeight',
            'PetFee',
            'LandlordAgentAddress',
            'TenantsMailingAddressForNotices',
            'AgentsFullName',
            'TotalAmount', // Amount due at signing
        ];
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
    public toolbarItems = ['New','Undo','Redo','Separator','Image','Table','Hyperlink','Bookmark','Comments','TableOfContents','Separator','Header','Footer','PageSetup','PageNumber','Break','Separator','Find','Separator','LocalClipboard','RestrictEditing'];

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
rlaBtnClicked(){
    this.chooseRLAStateHelperWithPrompt();
}
chooseRLAStateHelperWithPrompt(){
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
                    await this.saveHelper().then(()=>{
                        this.chooseRLAStateHelper();
                    });
                }
                else if(saveNoOrCancel == 'no'){
                    this.chooseRLAStateHelper();
                }
            })
        }
    else{
        this.chooseRLAStateHelper();
    }
}

chooseRLAStateHelper(){
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
                this.loadedFileName = null;
                this.savedNote = 'Not Saved';
                this.astrisk = "*";
            })
        }
    });
}

 rlaBtnItemSelected(args: MenuEventArgs){
    console.log("in constructor");

     let selectedItem: string = args.item.text;
     if (selectedItem == 'Choose State'){
        this.chooseRLAStateHelperWithPrompt();
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
                    await this.saveHelper().then(() => {
                        this.loadTemplateHelper();
                    })
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

 contentChanged(args: ContentChangeEventArgs ){
     this.savedNote = 'Not Saved';
     this.astrisk = "*";
}

saveAs(selectedItem: string){
    return new Promise((resolve, reject) => {
        let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};

        this.dialog.open(LeaseTemplatePopupModal, {
            data: {
                title: "Save As",
                contentSummary: "Enter Filename",
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
                        resolve(true);
                    })
                })
                .catch(() => {
                    reject();
                })
            }
            else{
                reject();
            }
        });
    });
}

async saveHelper(){
    return new Promise((resolve, reject) => {
        let sfdt: any = {content: this.documentEditorContainerComponent.documentEditor.serialize()};
        // Save file for the landlord for future use
        this.templateService.updateCustomTemplate(sfdt,this.loadedFileName).then((status: any)=>{
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
                    resolve(true);
                })
            }
        })
        .catch(() => {
            reject();
        })
    })
}

async serverBtnItemSelected(args: MenuEventArgs){
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
        this.mergeTagMainBtnClicked();
    }
}

mergeTagMainBtnClicked() {
    this.dialog.open(LeaseTemplatePopupModal, {
        data: {
            title: "Insert Merge Tag", // from 'Load Template'
            contentSummary: "Choose Merge Tag", 
            content: this.mergeTagKeys, // Need to set this up, also if returned list contains no elements, it should display different message
          }
    }).afterClosed().subscribe((selectedMergeTag: string) => {
        let fileName : string = selectedMergeTag.replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
        var fieldCode = 'MERGEFIELD  ' + fileName + "  \\* MERGEFORMAT blue";
        this.documentEditorContainerComponent.documentEditor.editor.insertField(fieldCode, '«' + selectedMergeTag + '»');
        this.documentEditorContainerComponent.documentEditor.focusIn();
        this.documentEditorContainerComponent.documentEditor.saveAsBlob("Docx").then(function (blob) {
        });
    })
}
closeSplitBtn(){
    console.log("closing split button");
}
}