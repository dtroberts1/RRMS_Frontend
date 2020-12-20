import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentProspectDto } from 'src/app/interfaces/DocumentProspect';
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
  displayedColumns: string[] = ['DocumentName','FName', 'LName', 'Signed', 'Move-in-Date', 'Term Type', 'Home', 'Room'];
  dataSource : Array<IDocumentProspectDto>;
  selection = new SelectionModel<IDocumentProspectDto>(false, []);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
  public dialogRef: MatDialogRef<LeaseDocProspectTableModalComponent>,
  public dialog: MatDialog, 
  ) {
    if (data != null){
      this.dataSource = Array.from(this.data.content);
    }

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
