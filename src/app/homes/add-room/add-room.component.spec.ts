import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from 'src/app/services/room.service';
import { AddRoomComponent } from './add-room.component';

let roomsServiceSpy: {createRoom: jasmine.Spy};

const fakeActivatedRoute  = {
  snapshot: {
      paramMap: {
          get(): string {
              return '123';
          },
      },
  },
}

describe('AddRoomComponent', () => {
  let component: AddRoomComponent;
  let fixture: ComponentFixture<AddRoomComponent>;

  beforeEach(async () => {
    roomsServiceSpy = jasmine.createSpyObj('RoomsService', ['createRoom']);
    await TestBed.configureTestingModule({
      declarations: [ AddRoomComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: MatDialog, useValue: {}},
        {provide: RoomsService, useValue: roomsServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
