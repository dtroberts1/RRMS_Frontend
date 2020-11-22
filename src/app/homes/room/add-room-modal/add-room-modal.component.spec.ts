import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomsService } from 'src/app/services/room.service';

import { AddRoomModalComponent } from './add-room-modal.component';

let roomServiceSpy: {createRoom: jasmine.Spy};

describe('AddRoomModalComponent', () => {
  let component: AddRoomModalComponent;
  let fixture: ComponentFixture<AddRoomModalComponent>;

  beforeEach(async () => {
    roomServiceSpy = jasmine.createSpyObj('RoomService', ['createRoom']);
    await TestBed.configureTestingModule({
      declarations: [ AddRoomModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {provide: MatDialog, useValue: {}},
        {provide: RoomsService, useValue: roomServiceSpy}
      ]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
