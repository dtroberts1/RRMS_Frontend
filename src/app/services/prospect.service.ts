import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IProspect} from '../interfaces/Prospect';
import { SalaryType } from '../interfaces/Employer';

@Injectable({
    providedIn: 'root'
})

export class ProspectService{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    prospects: Iterable<IProspect>;

    constructor(private http: HttpClient){
    }

    async saveProspect(prospect: IProspect){
        // Get token from localStorage
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
            };
        this.currToken = JSON.parse(localStorage.getItem('user'));
        if (this.currToken != null){
            console.log("Sending the following to the API: " + JSON.stringify(prospect));
            return new Promise((resolve, reject) => { this.http
                .post<IProspect>(this.tokenURL, prospect, options).subscribe(
                    prospect => {
                        // Get some logic for response (should just return id back for newly added home)
                        resolve(prospect);
                    },
                    error => {
                    console.log("Prospect post to API was unsuccessful.");
                    console.log(error);
                    reject(error);
                    }
                )
            });
        }
    }
    getProspects(){
        console.log("in getProspects, prospects is " + this.prospects);
        if ((this.prospects != null) && ((<any[]>this.prospects).length > 0)){
            return this.prospects;
        }
    }

   fetchProspects(){
     // Gets homes from database and stores locally
     // This must be called anytime homes are modified or saved in the database. 
       this.prospects = [{
        EmailAddress : "jaker@yahoo.com",
        FName : "Jake",
        LName : "Jogers",
        MdInit : "T",
        PhoneNumber: "541-554-3299",
        employers : [{    
            MgrEmailAddress : "john@hyundai.com",
            MgrPhoneNumber: "385-252-0453",
            MgrFName : "John",
            MgrLName : "Stoner",
            CompanyName: "Daytona Hyundai",
            addressStreet1: "444 5th St",
            addressStreet2: "",
            addressCity: "Daytona Beach",
            addressState: "FL",
            addressZipCode: "32119",
            prospectJobTitle: "Car Salesman",
            startDate: new Date(500000000000),
            endDate: new Date(500000000000),
            current: true,
            salaryType: SalaryType.hourly,
            prospectID: -1,}],
        previousRentals : [{
            PrevLandlordEmailAddress : "ssvendson@email.com",
            PrevLandlordPhoneNumber : "384-244-2222",
            PrevLandlordFName : "Sharlett",
            PrevLandlordLName : "Lewis",
            addressStreet1: "111 11th St",
            addressStreet2: "",
            addressCity: "Oakland",
            addressState: "CA",
            addressZipCode: "42888",
            startDate: new Date(500000000000),
            endDate: new Date(500000000000),
            current: true,
            prospectID: -1,
        }],
        SSN: "555-33-2222",
        status: ProspectStatus.pending,
        roomId: -1,
        prospectId:-1,
      },
      ];
   }
}

enum ProspectStatus {
    approved = 1,
    declined = 2,
    pending = 3,
  }