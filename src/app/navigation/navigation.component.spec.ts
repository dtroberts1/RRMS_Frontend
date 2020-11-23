import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomesService } from '../services/homes.service';
import { ProspectService } from '../services/prospect.service';
import { NavigationComponent } from './navigation.component';

let homesServiceSpy: {getHomes: jasmine.Spy};
let prospectServiceSpy: {getProspects: jasmine.Spy};

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    homesServiceSpy = jasmine.createSpyObj(HomesService, ['getHomes']);
    prospectServiceSpy = jasmine.createSpyObj(ProspectService, ['getProspects']);

    await TestBed.configureTestingModule({
      declarations: [ NavigationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: HomesService, useValue: homesServiceSpy},
        {provide: ProspectService, useValue: prospectServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
