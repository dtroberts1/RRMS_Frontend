import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseTemplatesComponent } from './lease-templates.component';

describe('LeaseTemplatesComponent', () => {
  let component: LeaseTemplatesComponent;
  let fixture: ComponentFixture<LeaseTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
