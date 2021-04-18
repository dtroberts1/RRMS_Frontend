import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselModifierComponent } from './carousel-modifier.component';

describe('CarouselModifierComponent', () => {
  let component: CarouselModifierComponent;
  let fixture: ComponentFixture<CarouselModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselModifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
