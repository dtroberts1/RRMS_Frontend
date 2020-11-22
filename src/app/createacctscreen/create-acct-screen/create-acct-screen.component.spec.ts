import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAcctScreenComponent } from './create-acct-screen.component';

let httpClientSpy: {get: jasmine.Spy};

describe('CreateAcctScreenComponent', () => {
  let component: CreateAcctScreenComponent;
  let fixture: ComponentFixture<CreateAcctScreenComponent>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      declarations: [ CreateAcctScreenComponent ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide:HttpClient, useValue: httpClientSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcctScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
