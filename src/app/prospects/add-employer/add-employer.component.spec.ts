import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployerComponent } from './add-employer.component';

describe('AddEmployerComponent', () => {
  let component: AddEmployerComponent;
  let fixture: ComponentFixture<AddEmployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
