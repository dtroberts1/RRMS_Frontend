import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseDocumentApprovalComponent } from './lease-document-approval.component';

describe('LeaseDocumentApprovalComponent', () => {
  let component: LeaseDocumentApprovalComponent;
  let fixture: ComponentFixture<LeaseDocumentApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseDocumentApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseDocumentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
