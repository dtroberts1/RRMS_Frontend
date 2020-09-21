import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAcctScreenComponent } from './create-acct-screen.component';

describe('CreateAcctScreenComponent', () => {
  let component: CreateAcctScreenComponent;
  let fixture: ComponentFixture<CreateAcctScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAcctScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcctScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
