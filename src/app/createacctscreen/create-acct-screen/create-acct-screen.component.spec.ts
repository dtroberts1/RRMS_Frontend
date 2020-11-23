import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService } from 'src/app/services/account.service';
import { CreateAcctScreenComponent } from './create-acct-screen.component';

let accountServiceSpy: {register: jasmine.Spy};

describe('CreateAcctScreenComponent', () => {
  let component: CreateAcctScreenComponent;
  let fixture: ComponentFixture<CreateAcctScreenComponent>;

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['register']);
    await TestBed.configureTestingModule({
      declarations: [ CreateAcctScreenComponent ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide:AccountService, useValue: accountServiceSpy},
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
