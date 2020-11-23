import { ComponentFixture, TestBed } from '@angular/core/testing';
//import {HttpClientModule} from '@angular/common/http';
import { CreateAcctEmailConfscrnComponent } from './create-acct-email-confscrn.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('CreateAcctEmailConfscrnComponent', () => {
  let component: CreateAcctEmailConfscrnComponent;
  let fixture: ComponentFixture<CreateAcctEmailConfscrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAcctEmailConfscrnComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcctEmailConfscrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
