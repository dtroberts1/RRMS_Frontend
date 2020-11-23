import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomesService } from '../services/homes.service';
import { HomesComponent } from './homes.component';

let homeServiceSpy: {getHomes: jasmine.Spy};

describe('HomesComponent', () => {
  let component: HomesComponent;
  let fixture: ComponentFixture<HomesComponent>;

  beforeEach(async () => {
    homeServiceSpy = jasmine.createSpyObj('HomesService', ['getHomes']);
    await TestBed.configureTestingModule({
      declarations: [ HomesComponent ],
      providers: [
        {provide: HomesService, useValue: homeServiceSpy},
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
