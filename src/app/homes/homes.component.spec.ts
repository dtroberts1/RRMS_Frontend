import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomesComponent } from './homes.component';

let httpClientSpy: {get: jasmine.Spy};

describe('HomesComponent', () => {
  let component: HomesComponent;
  let fixture: ComponentFixture<HomesComponent>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj(HttpClient, ['get']);
    await TestBed.configureTestingModule({
      declarations: [ HomesComponent ],
      providers: [
        {provide: HttpClient, useValue: httpClientSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
