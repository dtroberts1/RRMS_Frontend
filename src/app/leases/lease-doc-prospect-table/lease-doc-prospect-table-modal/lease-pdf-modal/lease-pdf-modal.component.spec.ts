import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasePdfModalComponent } from './lease-pdf-modal.component';

describe('LeasePdfModalComponent', () => {
  let component: LeasePdfModalComponent;
  let fixture: ComponentFixture<LeasePdfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeasePdfModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasePdfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
