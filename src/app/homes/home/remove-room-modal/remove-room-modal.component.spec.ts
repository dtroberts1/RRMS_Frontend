import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRoomModalComponent } from './remove-room-modal.component';

describe('RemoveRoomModalComponent', () => {
  let component: RemoveRoomModalComponent;
  let fixture: ComponentFixture<RemoveRoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveRoomModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
