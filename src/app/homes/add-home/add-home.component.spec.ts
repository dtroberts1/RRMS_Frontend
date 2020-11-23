import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesService } from 'src/app/services/homes.service';
import { AddHomeComponent } from './add-home.component';

let homeServiceSpy: {createHome: jasmine.Spy};
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
    homeServiceSpy = jasmine.createSpyObj(HttpClient, ['createHome']);
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ AddHomeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: HomesService, useValue: homeServiceSpy},
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
