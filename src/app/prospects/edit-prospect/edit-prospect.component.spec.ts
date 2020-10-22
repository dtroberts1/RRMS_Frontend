import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProspectComponent } from './edit-prospect.component';

describe('EditProspectComponent', () => {
  let component: EditProspectComponent;
  let fixture: ComponentFixture<EditProspectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProspectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
