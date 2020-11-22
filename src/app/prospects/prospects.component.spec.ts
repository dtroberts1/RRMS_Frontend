import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ProspectService } from '../services/prospect.service';
import { ProspectsComponent } from './prospects.component';

let prospectServiceSpy: {getProspects: jasmine.Spy};

describe('ProspectsComponent', () => {
  let component: ProspectsComponent;
  let fixture: ComponentFixture<ProspectsComponent>;

  beforeEach(async () => {
    prospectServiceSpy = jasmine.createSpyObj(ProspectService, ['getProspects']);
    await TestBed.configureTestingModule({
      declarations: [ ProspectsComponent ],
      providers: [
        {provide: MatDialog, useValue: {}},
        {provide: ProspectService, useValue: prospectServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
