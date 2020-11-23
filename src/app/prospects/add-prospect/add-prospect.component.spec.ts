import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesService } from 'src/app/services/homes.service';
import { ProspectService } from 'src/app/services/prospect.service';
import { RoomsService } from 'src/app/services/room.service';
import { AddProspectComponent } from './add-prospect.component';

let routerSpy: {navigate: jasmine.Spy};
let prospectServiceSpy: {saveProspect: jasmine.Spy};
let homesServiceSpy: {getHomes: jasmine.Spy};
let roomsServiceSpy: {getRoom: jasmine.Spy};

describe('AddProspectComponent', () => {
  let component: AddProspectComponent;
  let fixture: ComponentFixture<AddProspectComponent>;
  const fakeActivatedRoute  = {
    snapshot: {
        paramMap: {
            get(): string {
                return '123';
            },
        },
    },
}
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    prospectServiceSpy = jasmine.createSpyObj('ProspectService', ['saveProspect']);
    homesServiceSpy = jasmine.createSpyObj('HomesService', ['getHomes']);
    roomsServiceSpy = jasmine.createSpyObj('RoomsService', ['getRoom']);

    await TestBed.configureTestingModule({
      declarations: [ AddProspectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: MatDialog, useValue: {}},
        {provide: Router, useValue: routerSpy},
        {provide: ProspectService, useValue: prospectServiceSpy},
        {provide: HomesService, useValue: homesServiceSpy},
        {provide: RoomsService, useValue: roomsServiceSpy}, 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
