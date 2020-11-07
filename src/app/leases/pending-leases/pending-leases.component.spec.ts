import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLeasesComponent } from './pending-leases.component';

describe('PendingLeasesComponent', () => {
  let component: PendingLeasesComponent;
  let fixture: ComponentFixture<PendingLeasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingLeasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingLeasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
