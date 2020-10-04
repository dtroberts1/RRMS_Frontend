import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDataRRMSDialog } from './dialog-data.component';

describe('DialogDataComponent', () => {
  let component: DialogDataRRMSDialog;
  let fixture: ComponentFixture<DialogDataRRMSDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDataRRMSDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDataRRMSDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
