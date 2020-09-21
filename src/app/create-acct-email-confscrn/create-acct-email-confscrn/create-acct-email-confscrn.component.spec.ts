import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcctEmailConfscrnComponent } from './create-acct-email-confscrn.component';

describe('CreateAcctEmailConfscrnComponent', () => {
  let component: CreateAcctEmailConfscrnComponent;
  let fixture: ComponentFixture<CreateAcctEmailConfscrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAcctEmailConfscrnComponent ]
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
