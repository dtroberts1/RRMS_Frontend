import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogDataRRMSDialog } from './dialog-data.component';

describe('DialogDataComponent', () => {
  let component: DialogDataRRMSDialog;
  let fixture: ComponentFixture<DialogDataRRMSDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDataRRMSDialog ],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDataRRMSDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
