import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProspectService } from 'src/app/services/prospect.service';
import { RoomsService } from 'src/app/services/room.service';
import { HomeDetailsComponent } from './home-details.component';

let routerSpy: {navigate: jasmine.Spy};
let roomsServiceSpy: {getAvailableRooms: jasmine.Spy};
let prospectServiceSpy: {getAvailableProspects: jasmine.Spy};

const fakeActivatedRoute  = {
  snapshot: {
      paramMap: {
          get(): string {
              return '123';
          },
      },
  },
}
describe('HomeDetailsComponent', () => {
  let component: HomeDetailsComponent;
  let fixture: ComponentFixture<HomeDetailsComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);
    roomsServiceSpy = jasmine.createSpyObj(RoomsService, ['getAvailableRooms']);
    prospectServiceSpy = jasmine.createSpyObj(ProspectService, ['getAvailableProspects']);

    await TestBed.configureTestingModule({
      declarations: [ HomeDetailsComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialog, useValue: {}},
        {provide: MatDialogModule, useValue: {}},
        {provide: Router, useValue: routerSpy},
        {provide: RoomsService, useValue: roomsServiceSpy},
        {provide: ProspectService, useValue: prospectServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
