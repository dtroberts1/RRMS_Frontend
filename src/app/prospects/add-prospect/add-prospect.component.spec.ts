import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProspectComponent } from './add-prospect.component';

describe('AddProspectComponent', () => {
  let component: AddProspectComponent;
  let fixture: ComponentFixture<AddProspectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProspectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
