import { TestBed } from '@angular/core/testing';
import { EmployerService } from './employer.service';

let httpClientSpy: { get: jasmine.Spy };

describe('EmployerService', () => {
  let service: EmployerService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({});
    service = new EmployerService(httpClientSpy as any);

    //service = TestBed.inject(EmployerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
