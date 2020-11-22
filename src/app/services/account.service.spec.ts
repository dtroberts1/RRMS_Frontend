import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';

let httpClientSpy: { get: jasmine.Spy };
let homeSpy: {getHome: jasmine.Spy};

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    homeSpy = jasmine.createSpyObj('HomeService', ['getHome']);

    TestBed.configureTestingModule({});
    service = new AccountService(httpClientSpy as any, homeSpy as any);

    //service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
