import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkRoomModalComponent } from './link-room-modal.component';

describe('LinkRoomModalComponent', () => {
  let component: LinkRoomModalComponent;
  let fixture: ComponentFixture<LinkRoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkRoomModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
