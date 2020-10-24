import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyEmployerModalComponent } from './modify-employer-modal.component';

describe('ModifyEmployerModalComponent', () => {
  let component: ModifyEmployerModalComponent;
  let fixture: ComponentFixture<ModifyEmployerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyEmployerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyEmployerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
