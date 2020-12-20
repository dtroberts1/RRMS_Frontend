import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendLeaseEmailModalComponent } from './send-lease-email-modal.component';

describe('SendLeaseEmailModalComponent', () => {
  let component: SendLeaseEmailModalComponent;
  let fixture: ComponentFixture<SendLeaseEmailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendLeaseEmailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendLeaseEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
