import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
export interface DialogData {
  inError: boolean;
  title: string;
  contentSummary: string
  errorItems: Array<any>;
}

@Component({
  selector: 'dialog-data',
  templateUrl: 'dialog-data-rrms-component.html',
})
export class DialogDataRRMSDialog {
  inError: boolean;
  title: string;
  contentSummary: string;
  errorItems: Array<any>;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
  public dialogRef: MatDialogRef<DialogDataRRMSDialog>,
  ) {
    this.inError = data.inError;
    this.title = data.title;
    this.contentSummary = data.contentSummary;
    this.errorItems = data.errorItems;
  }

  closeDialog(yes:boolean){
    this.dialogRef.close(yes);
  }
  ngOnInit(): void {
  }
}
