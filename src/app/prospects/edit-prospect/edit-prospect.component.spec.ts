import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomesService } from 'src/app/services/homes.service';
import { ProspectService } from 'src/app/services/prospect.service';
import { RoomsService } from 'src/app/services/room.service';
import { EditProspectComponent } from './edit-prospect.component';

let roomsServiceSpy: {getRoom: jasmine.Spy};
let homesServiceSpy: {getHomes: jasmine.Spy};
let prospectServiceSpy: {updateProspect: jasmine.Spy, removeProspect: jasmine.Spy};


describe('EditProspectComponent', () => {
  let component: EditProspectComponent;
  let fixture: ComponentFixture<EditProspectComponent>;

  beforeEach(async () => {
    roomsServiceSpy = jasmine.createSpyObj('RoomsService', ['getRoom']);
    homesServiceSpy = jasmine.createSpyObj('HomesService', ['getHomes']);
    prospectServiceSpy = jasmine.createSpyObj('ProspectService', ['updateProspect', 'removeProspect']);
    await TestBed.configureTestingModule({
      declarations: [ EditProspectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: MatDialog, useValue: {}},
        {provide: RoomsService, useValue: roomsServiceSpy},
        {provide: HomesService, useValue: homesServiceSpy},
        {provide: ProspectService, useValue: prospectServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
