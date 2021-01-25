import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { IDocumentDeliveries } from 'src/app/interfaces/DocumentDeliveries';
import { IDocumentProspectDto, TermType } from 'src/app/interfaces/DocumentProspect';
import { DocumentDeliveryService } from 'src/app/services/documentDelivery.service';
import { LeaseDocumentService } from 'src/app/services/leaseDocument.service';
import { LeasesPopupModal } from '../../leases/leases-popup-modal/leases-popup-modal.component';
import { DocumentDeliveriesModalComponent } from '../document-deliveries-modal/document-deliveries-modal.component';
import { SendLeaseEmailModalComponent } from '../send-lease-email-modal/send-lease-email-modal.component';
import { LeasePdfModalComponent } from './lease-pdf-modal/lease-pdf-modal.component';

interface ModalData {
  content: Iterable<IDocumentProspectDto>,
}

interface EmailedLeaseDocMessage{
  message:string,
  subject: string,
  body: string,
  leaseDocumentId: number,
}

@Component({
  selector: 'app-lease-doc-prospect-table-modal',
  templateUrl: './lease-doc-prospect-table-modal.component.html',
  styleUrls: ['./lease-doc-prospect-table-modal.component.css']
})
export class LeaseDocProspectTableModalComponent implements OnInit {
  displayedColumns: string[] = ['DocumentName','FName', 'LName', 'ReadOnly','TenantSigned', 'LandlordSigned', 'LeaseDeclined', 'Move-in-Date', 'Term Type', 'Home', 'Room', 'Delivered Date'];
  dataSource : Array<IDocumentProspectDto>;
  selection = new SelectionModel<IDocumentProspectDto>(false, []);
  openDocOrPdf : string = "Open Document";
  dateOptions : {hour: string, minute: string, hour12: boolean} = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  termMap = new Map<TermType, string>([
    [TermType.fixedTerm, "Fixed-Term"],
    [TermType.monthToMonth, "Monthly", ],
  ])
  dateNotTimeOptions : {year: string, month: string, day: string} = {
  year: 'numeric', month: 'long', day: 'numeric'
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    public dialogRef: MatDialogRef<LeaseDocProspectTableModalComponent>,
    public dialog: MatDialog, 
    private documentDeliveryService : DocumentDeliveryService,
    private leaseDocumentService : LeaseDocumentService,
    ) {
    if (data != null){
      this.setupTable();
    }

  }
  deleteDocument(){
    if (this.selection != null && this.selection.selected[0] != null){
      this.dialog.open(DialogDataRRMSDialog, {
        data: {
          inError: false,
          title: "Delete - Are you sure?",
          contentSummary: `Are you sure you would like to delete this lease document "${this.selection.selected[0].DocumentName}"?`,
          errorItems: []
        }
      }).afterClosed().subscribe((deleteLease: boolean)=> {
        if (deleteLease == true){
          this.leaseDocumentService.removeLeaseDocument(this.selection.selected[0].DocumentId)
            .then((result) => {
              // Update UI List
              this.leaseDocumentService.getDocumentProspectDtos()
                .then((leaseDocDtos: Iterable<IDocumentProspectDto>) =>{
                  this.dialog.open(LeasesPopupModal, {
                    data: {
                        title: "Deleted",
                        contentSummary: `${this.selection.selected[0].DocumentName} has been removed`,
                        content: null,
                      }
                  })
                  .afterClosed().subscribe(() => {
                    this.data.content = leaseDocDtos;
                    this.setupTable();
                  })
              })
            })
          }
      });
    }
    else{
      this.dialog.open(DialogDataRRMSDialog, {
        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      }).afterClosed().subscribe((result) => {

      });
    }
  }
  getTermTypeStr(termType: TermType){
    return this.termMap.get(termType);
  }

  setupTable(){
    this.dataSource = Array.from(this.data.content);    
    this.dataSource.forEach((dataItem) => {
      if (dataItem.MoveInDate != null){
        dataItem.MoveInDate = new Date(dataItem.MoveInDate + 'Z');
      }
      if (dataItem.MoveOutDate != null){
        dataItem.MoveOutDate = new Date(dataItem.MoveOutDate + 'Z');
      }
      if (dataItem.LatestDocDelivery != null){
        dataItem.LatestDocDelivery = new Date(dataItem.LatestDocDelivery + 'Z');
      }

    })    
  }
  nicelyFormatLatestDocDel(item: IDocumentProspectDto){
    if (item != null && item.LatestDocDelivery != null)
    {
      return item.LatestDocDelivery.toLocaleString();
    }
    else
      return null;
  }
  isReadOnly(docPros: IDocumentProspectDto){
    if (docPros.TenantSigned == true){
      return true;
    }
    else{
      return false;
    }
  }
  openDocDeliveries(docPros: IDocumentProspectDto){
    console.log("opening doc deliveries");
      this.documentDeliveryService.GetDocumentDeliveries(docPros.DocumentId).then((documentDeliveries: Iterable<IDocumentDeliveries>) => {
        console.log("back in loadDocumentsHelper, returned object is " + JSON.stringify(documentDeliveries));
        this.dialog.open(DocumentDeliveriesModalComponent, {
            data: {
                content: documentDeliveries,
            }
        });
    });
  }
  sendEmail(){
    // Should first open a modal
    if (this.selection != null && this.selection.selected[0] != null)
    {
      this.dialog.open(SendLeaseEmailModalComponent,{
        data: {docProspectDto: this.selection.selected[0]},
        }
        ).afterClosed().subscribe((emailSent: boolean) => {
          if (emailSent == true){
            this.dialogRef.close(null);
          }
        })
    }
    else{
      this.dialog.open(DialogDataRRMSDialog, {
        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      }).afterClosed().subscribe((result) => {

      });
    }
    
    // Send email (send back EmailedLeaseDocMessage)
  }
  tableClicked(){
    console.log("Table clicked");
    if (this.selection != null && this.selection.selected[0] != null)
    {
      if(this.selection.selected[0].TenantSigned == true){
        this.openDocOrPdf = "Open PDF";
      }
      else{
        this.openDocOrPdf = "Open Document";
      }
    }
  }

  closeBtnClicked(){
    this.dialogRef.close(null);
  }
  openDocument(){
    if (this.selection != null && this.selection.selected[0] != null)
    {
      if (this.openDocOrPdf == "Open Document"){
        this.dialogRef.close({
          selectedTemplate: this.selection.selected[0].DocumentName, 
          prospectId: this.selection.selected[0].ProspectId,
          selectedDocId: this.selection.selected[0].DocumentId,
        });
      }
      else if(this.openDocOrPdf == "Open PDF"){
        // Open PDF Viewer
        this.dialog.open(LeasePdfModalComponent, {
          data: {
            LeaseDocId: this.selection.selected[0].DocumentId, // Need to pass in something here!!!!!!
          },
          width: '55%',
          height: '91%',
      })
        .afterClosed().subscribe((res) => {
          //this.selection = null;
        }
        )
      }
    }
    else{
      this.dialog.open(DialogDataRRMSDialog, {
        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      }).afterClosed().subscribe((result) => {

      });
    }
  }

  ngOnInit(): void {
  }

}
