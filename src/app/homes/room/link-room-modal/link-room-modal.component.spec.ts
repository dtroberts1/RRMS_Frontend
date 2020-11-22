import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LinkRoomModalComponent } from './link-room-modal.component';

describe('LinkRoomModalComponent', () => {
  let component: LinkRoomModalComponent;
  let fixture: ComponentFixture<LinkRoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkRoomModalComponent ],
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
    fixture = TestBed.createComponent(LinkRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
