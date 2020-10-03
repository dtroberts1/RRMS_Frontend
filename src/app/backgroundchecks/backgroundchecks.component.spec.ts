import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundchecksComponent } from './backgroundchecks.component';

describe('BackgroundchecksComponent', () => {
  let component: BackgroundchecksComponent;
  let fixture: ComponentFixture<BackgroundchecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundchecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundchecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
