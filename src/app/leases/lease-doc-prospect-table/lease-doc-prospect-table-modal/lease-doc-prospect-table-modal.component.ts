import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentProspectDto } from 'src/app/interfaces/DocumentProspect';

interface ModalData {
  content: Iterable<IDocumentProspectDto>,
}
@Component({
  selector: 'app-lease-doc-prospect-table-modal',
  templateUrl: './lease-doc-prospect-table-modal.component.html',
  styleUrls: ['./lease-doc-prospect-table-modal.component.css']
})
export class LeaseDocProspectTableModalComponent implements OnInit {
  displayedColumns: string[] = ['DocumentName','FName', 'LName', 'Signed', 'Move-in-Date', 'Term Type', 'Home', 'Room'];
  dataSource : Array<IDocumentProspectDto>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
  public dialogRef: MatDialogRef<LeaseDocProspectTableModalComponent>,
  public dialog: MatDialog, 
  ) {
    if (data != null){
      this.dataSource = Array.from(this.data.content);
    }

  }

  ngOnInit(): void {
  }

}
