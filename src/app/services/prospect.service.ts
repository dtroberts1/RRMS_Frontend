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
    private prospectsUrl = 'http://localhost:64097/api/Prospects';

    constructor(private http: HttpClient){
    }

    async saveProspect(prospect: IProspect){
     // Get token from localStorage
     console.log("in saveProspect, about to send" + JSON.stringify(prospect));
     this.currToken = JSON.parse(localStorage.getItem('user'));
     if (this.currToken != null){
       let options = {
         headers: new HttpHeaders().set('Content-Type', 'application/json')
         .set('Authorization', "bearer " + this.currToken),
         };
       return new Promise((resolve, reject) => { this.http
           .post<IProspect>(this.prospectsUrl, prospect, options).subscribe(
            prospect => {
                   // Get some logic for response (should just return id back for newly added home)
                   resolve(prospect);
               },
               error => {
                 reject(error);
               }
           )
       });
     }
    }

    getProspects(): Promise<Iterable<IProspect>>{
        return new Promise((resolve, reject) => {
    
          console.log("in getHomes, homes is " + this.prospects);
          this.fetchProspects().then((homes: Iterable<IProspect>) => {
            this.prospects = homes;
            resolve(this.prospects);
          }).catch((err) => {
            reject(err);
          });
        });
      }

   fetchProspects(){
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
        let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        return new Promise((resolve, reject) => {
        this.http
            .get<Iterable<IProspect>>(this.prospectsUrl, options).subscribe(
                prospects => {
                    // Get some logic for response (should just return id back for newly added home)
                    resolve(prospects);
                },
                error => {
                console.log("Home post to API was unsuccessful.");
                console.log(error);
                reject(error);
                }
            );
        });
        }
     // Gets homes from database and stores locally
     // This must be called anytime homes are modified or saved in the database. 
     /*
       this.prospects = [{
        EmailAddress : "jaker@yahoo.com",
        FName : "Jake",
        LName : "Jogers",
        MdInit : "T",
        PhoneNumber: "541-554-3299",
        Employers : [{    
            MgrEmailAddress : "john@hyundai.com",
            MgrPhoneNumber: "385-252-0453",
            MgrFName : "John",
            MgrLName : "Stoner",
            CompanyName: "Daytona Hyundai",
            AddressStreet1: "444 5th St",
            AddressStreet2: "",
            AddressCity: "Daytona Beach",
            AddressState: "FL",
            AddressZipCode: "32119",
            ProspectJobTitle: "Car Salesman",
            StartDate: new Date(500000000000),
            EndDate: new Date(500000000000),
            Current: true,
            SalaryType: SalaryType.hourly,
            ProspectId: -1,}],
        PreviousRentals : [{
            PrevLandlordEmailAddress : "ssvendson@email.com",
            PrevLandlordPhoneNumber : "384-244-2222",
            PrevLandlordFName : "Sharlett",
            PrevLandlordLName : "Lewis",
            AddressStreet1: "111 11th St",
            AddressStreet2: "",
            AddressCity: "Oakland",
            AddressState: "CA",
            AddressZipCode: "42888",
            StartDate: new Date(500000000000),
            EndDate: new Date(500000000000),
            Current: true,
            ProspectId: -1,
        }],
        SSN: "555-33-2222",
        Status: ProspectStatus.pending,
        RoomId: -1,
        ProspectId:-1,
      },
      ];
      */
   }
}

enum ProspectStatus {
    approved = 1,
    declined = 2,
    pending = 3,
  }