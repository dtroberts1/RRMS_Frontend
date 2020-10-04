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

    constructor(private http: HttpClient){}

   async login(home: IHome){
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
}