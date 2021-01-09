import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentDeliveries } from 'src/app/interfaces/DocumentDeliveries';
import { IDocumentProspectDto } from 'src/app/interfaces/DocumentProspect';
import { DocumentDeliveryService } from 'src/app/services/documentDelivery.service';
import { LeaseDocumentService } from 'src/app/services/leaseDocument.service';
import { DocumentDeliveriesModalComponent } from '../document-deliveries-modal/document-deliveries-modal.component';
import { SendLeaseEmailModalComponent } from '../send-lease-email-modal/send-lease-email-modal.component';

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
  displayedColumns: string[] = ['DocumentName','FName', 'LName', 'Signed', 'Move-in-Date', 'Term Type', 'Home', 'Room', 'Delivered Date'];
  dataSource : Array<IDocumentProspectDto>;
  selection = new SelectionModel<IDocumentProspectDto>(false, []);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    public dialogRef: MatDialogRef<LeaseDocProspectTableModalComponent>,
    public dialog: MatDialog, 
    private documentDeliveryService : DocumentDeliveryService,
    private leaseDocumentService : LeaseDocumentService,
    ) {
    if (data != null){
      this.dataSource = Array.from(this.data.content);
    }

  }
  deleteDocument(){
    if (this.selection != null && this.selection.selected[0] != null)
    {
      this.leaseDocumentService.removeLeaseDocument(this.selection.selected[0].DocumentId)
        .then((result) => {
          console.log("Result of deletion is " + result);
          // Update UI List
          this.leaseDocumentService.getDocumentProspectDtos()
            .then((leaseDocDtos: Iterable<IDocumentProspectDto>) =>{
              this.data.content = leaseDocDtos;
              this.dataSource = Array.from(this.data.content);
            })
          
        })
    }
    else{
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
      console.log("selected is null. needs a message prompt");
    }
    
    // Send email (send back EmailedLeaseDocMessage)


  }

  closeBtnClicked(){
    this.dialogRef.close(null);
  }
  openDocument(){
    if (this.selection != null && this.selection.selected[0] != null)
    {
      this.dialogRef.close({selectedTemplate: this.selection.selected[0].DocumentName, 
        prospectId: this.selection.selected[0].ProspectId }); // Return the filename (without ext)
    }
    else{
    }
  }

  ngOnInit(): void {
  }

}
