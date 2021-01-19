import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineLeaseModalComponent } from './decline-lease-modal.component';

describe('DeclineLeaseModalComponent', () => {
  let component: DeclineLeaseModalComponent;
  let fixture: ComponentFixture<DeclineLeaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclineLeaseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclineLeaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
