import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDeliveriesModalComponent } from './document-deliveries-modal.component';

describe('DocumentDeliveriesModalComponent', () => {
  let component: DocumentDeliveriesModalComponent;
  let fixture: ComponentFixture<DocumentDeliveriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentDeliveriesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDeliveriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
