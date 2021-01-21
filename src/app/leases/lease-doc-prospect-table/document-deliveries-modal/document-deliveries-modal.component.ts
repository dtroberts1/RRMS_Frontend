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
  displayedColumns: string[] = ['Delivery Date','To Address', 'DocumentDeclined'];

  dataSource : Array<IDocumentDeliveries>;
  dateOptions : {hour: string, minute: string, hour12: boolean} = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    public dialogRef: MatDialogRef<DocumentDeliveriesModalComponent>,
    public dialog: MatDialog, 
  ) {
    if (data != null){

      this.dataSource = Array.from(this.data.content);
      this.dataSource.forEach((dataItem) => {
        dataItem.DeliveryDate = new Date(dataItem.DeliveryDate + 'Z');
      })
    }
   }

  ngOnInit(): void {
    
  }
  closeBtnClicked(){
    this.dialogRef.close(null);
  }
}
