import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovedProspectComponentModal } from './add-approved-prospect.component';

describe('AddApprovedProspectComponentModal', () => {
  let component: AddApprovedProspectComponentModal;
  let fixture: ComponentFixture<AddApprovedProspectComponentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApprovedProspectComponentModal ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApprovedProspectComponentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
