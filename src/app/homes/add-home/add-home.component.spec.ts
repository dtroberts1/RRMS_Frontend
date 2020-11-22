import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddHomeComponent } from './add-home.component';

let httpClientSpy: {get: jasmine.Spy};
let routerSpy: {navigate: jasmine.Spy};

describe('AddHomeComponent', () => {
  let component: AddHomeComponent;
  let fixture: ComponentFixture<AddHomeComponent>;
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
    httpClientSpy = jasmine.createSpyObj(HttpClient, ['get']);
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ AddHomeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: HttpClient, useValue: httpClientSpy},
        {provide: MatDialog, useValue: {}},
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: Router, useValue: routerSpy},

      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
