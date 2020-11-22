import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddProspectComponent } from './add-prospect.component';

let routerSpy: {navigate: jasmine.Spy};
let httpClientSpy: {get: jasmine.Spy};

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
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      declarations: [ AddProspectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: MatDialog, useValue: {}},
        {provide: Router, useValue: routerSpy},
        {provide: HttpClient, useValue: httpClientSpy},
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
