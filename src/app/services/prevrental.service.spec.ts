import { TestBed } from '@angular/core/testing';
import { PreviousRental } from './prevrental.service';

let httpClientSpy: { get: jasmine.Spy };

describe('PreviousRental', () => {
  let service: PreviousRental;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({});
    service = new PreviousRental(httpClientSpy as any);

    //service = TestBed.inject(PreviousRental);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
