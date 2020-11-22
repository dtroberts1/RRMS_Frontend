import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialFileUploadComponent } from './material-file-upload.component';

let httpClientSpy: { get: jasmine.Spy };

describe('MaterialFileUploadComponent', () => {
  let component: MaterialFileUploadComponent;
  let fixture: ComponentFixture<MaterialFileUploadComponent>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    await TestBed.configureTestingModule({
      declarations: [ MaterialFileUploadComponent ],
      providers: [{provide: HttpClient, useValue: httpClientSpy}],
    })
    .compileComponents();
  });

  beforeEach(() => {
   // fixture = TestBed.createComponent(MaterialFileUploadComponent);
    fixture = TestBed.createComponent(MaterialFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
