import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
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
  action: Subject<any> = new Subject();
  inError: boolean;
  title: string;
  contentSummary: string;
  errorItems: Array<any>;
  constructor(/*@Inject(MAT_DIALOG_DATA) public data: DialogData,
  public dialogRef: MatDialogRef<DialogDataRRMSDialog>,*/
  ) {
  }
  closedWithSaved(save: boolean){
    this.action.next(save);
  }

  closeDialog(yes:boolean){
    this.action.next(yes);
  }
  ngOnInit(): void {
    console.log("in init");
    console.log("title is " + JSON.stringify(this.title));
    console.log("contentSummary is " + JSON.stringify(this.contentSummary));
    console.log("errorItems is " + JSON.stringify(this.errorItems));

  }
}
