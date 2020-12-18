import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseDocProspectTableModalComponent } from './lease-doc-prospect-table-modal.component';

describe('LeaseDocProspectTableModalComponent', () => {
  let component: LeaseDocProspectTableModalComponent;
  let fixture: ComponentFixture<LeaseDocProspectTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseDocProspectTableModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseDocProspectTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
