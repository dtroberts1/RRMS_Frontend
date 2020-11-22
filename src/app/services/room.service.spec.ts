import { TestBed } from '@angular/core/testing';
import { RoomsService } from './room.service';

let httpClientSpy: { get: jasmine.Spy };

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({});
    service = new RoomsService(httpClientSpy as any);

    //service = TestBed.inject(RoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
