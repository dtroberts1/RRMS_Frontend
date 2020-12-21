import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentDeliveries } from 'src/app/interfaces/DocumentDeliveries';

interface ModalData {
  content: Iterable<IDocumentDeliveries>,
}

@Component({
  selector: 'app-document-deliveries-modal',
  templateUrl: './document-deliveries-modal.component.html',
  styleUrls: ['./document-deliveries-modal.component.css']
})
export class DocumentDeliveriesModalComponent implements OnInit {
  displayedColumns: string[] = ['Delivery Date','To Address'];

  dataSource : Array<IDocumentDeliveries>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    public dialogRef: MatDialogRef<DocumentDeliveriesModalComponent>,
    public dialog: MatDialog, 
  ) {
    if (data != null){
      this.dataSource = Array.from(this.data.content);
      console.log("dataSource is " + JSON.stringify(this.dataSource))
    }
   }

  ngOnInit(): void {
    
  }
  closeBtnClicked(){
    this.dialogRef.close(null);
  }
}
