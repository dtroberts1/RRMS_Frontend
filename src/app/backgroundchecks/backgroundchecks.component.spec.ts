import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundChecksComponent } from './backgroundchecks.component';

describe('BackgroundchecksComponent', () => {
  let component: BackgroundChecksComponent;
  let fixture: ComponentFixture<BackgroundChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
