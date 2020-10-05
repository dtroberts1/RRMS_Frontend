import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IHome} from '../interfaces/Homes';


@Injectable({
    providedIn: 'root'
})

export class HomesService{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    homes: Iterable<IHome>;

    constructor(private http: HttpClient){
    }

   getHomes(){
       console.log("in getHomes, homes is " + this.homes);
       if ((this.homes != null) && ((<any[]>this.homes).length > 0)){
           return this.homes;
       }
   }
    async saveHome(home: IHome){
        // Get token from localStorage
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
            };
        this.currToken = JSON.parse(localStorage.getItem('user'));
        if (this.currToken != null){
            console.log("Sending the following to the API: " + JSON.stringify(home));
            return new Promise((resolve, reject) => { this.http
                .post<AToken>(this.tokenURL, home, options).subscribe(
                    data => {
                        // Get some logic for response
                        resolve();
                    },
                    error => {
                    console.log("Home post to API was unsuccessful.");
                    console.log(error);
                    reject(error);
                    }
                )
            });
        }
    }
   fetchHomes(){
       this.homes = [{
        summary: "This is my house",
        addressStreet1: "47725 W 1st St",
        addressStreet2: "g",
        addressCity: "Oakridge",
        addressState: "OR",
        addressZipCode: "97463",
        averageRate: 1,
        nbrRooms: 4,
        homeImagePath: "../../assets/anotherhomepic.jpg",
        nickname: "My Beautiful home",
        tenants: [
          {
            firstName: "John",
            lastName: "Doe",
            midInit: "E"
          }
        ]
      },
      {
        summary: "This is my Second house",
        addressStreet1: "3537 Egret Dr",
        addressStreet2: "",
        addressCity: "Melbourne",
        addressState: "FL",
        addressZipCode: "32901",
        averageRate: 1,
        nbrRooms: 4,
        homeImagePath: "../../assets/secondhouse.jpg",
        nickname: "My Other Beautiful home",
        tenants: [
          {
            firstName: "John",
            lastName: "Doe",
            midInit: "E"
          }
        ]
      },
      {
        summary: "This is my Third house",
        addressStreet1: "1212 Egret Dr",
        addressStreet2: "",
        addressCity: "San Francisco",
        addressState: "CA",
        addressZipCode: "24222",
        averageRate: 1,
        nbrRooms: 4,
        homeImagePath: "../../assets/thirdhouse.jpg",
        nickname: "My Other Beautiful home",
        tenants: [
          {
            firstName: "John",
            lastName: "Doe",
            midInit: "E"
          }
        ]
      },
      ];
   }
}