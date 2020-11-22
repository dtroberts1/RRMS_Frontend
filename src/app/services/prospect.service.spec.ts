import { TestBed } from '@angular/core/testing';
import { ProspectService } from './prospect.service';

let httpClientSpy: { get: jasmine.Spy };

describe('ProspectService', () => {
  let service: ProspectService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({});
    service = new ProspectService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
