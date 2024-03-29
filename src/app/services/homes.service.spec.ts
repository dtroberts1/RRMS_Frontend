import { TestBed } from '@angular/core/testing';
import { HomesService } from './homes.service';

let httpClientSpy: { get: jasmine.Spy };

describe('HomesService', () => {
  let service: HomesService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({});
    service = new HomesService(httpClientSpy as any);

    //service = TestBed.inject(HomesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
