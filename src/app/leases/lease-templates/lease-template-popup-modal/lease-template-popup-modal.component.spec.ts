import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeaseTemplatePopupModal } from './choose-state-modal.component';

describe('LinkRoomModalComponent', () => {
  let component: LeaseTemplatePopupModal;
  let fixture: ComponentFixture<LeaseTemplatePopupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseTemplatePopupModal ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: MatDialog, useValue: {}},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseTemplatePopupModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
