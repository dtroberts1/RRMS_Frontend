import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import { IPreviousRental } from '../interfaces/PreviousRental';

@Injectable({
    providedIn: 'root'
})

export class PreviousRental{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    prevRentals: Iterable<IPreviousRental>;
    private prevRentalsUrl = 'http://localhost:64097/api/PreviousRentals';

    constructor(private http: HttpClient){
    }

    async savePrevRental(prevRental: IPreviousRental){
     // Get token from localStorage
     this.currToken = JSON.parse(localStorage.getItem('user'));
     if (this.currToken != null){
       let options = {
         headers: new HttpHeaders().set('Content-Type', 'application/json')
         .set('Authorization', "bearer " + this.currToken),
         };
       return new Promise((resolve, reject) => { this.http
           .post<IPreviousRental>(this.prevRentalsUrl, prevRental, options).subscribe(
            prevRental => {
                   resolve(prevRental);
               },
               error => {
                 reject(error);
               }
           )
       });
     }
    }

    getPrevRentals(): Promise<Iterable<IPreviousRental>>{
        return new Promise((resolve, reject) => {
    
          console.log("in getPrevRentals, prevRentals is " + this.prevRentals);
          this.fetchPrevRentals().then((prevRentals: Iterable<IPreviousRental>) => {
            this.prevRentals = prevRentals;
            resolve(this.prevRentals);
          }).catch((err) => {
            reject(err);
          });
        });
      }

   fetchPrevRentals(){
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
        let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        return new Promise((resolve, reject) => {
        this.http
            .get<Iterable<IPreviousRental>>(this.prevRentalsUrl, options).subscribe(
              prevRentals => {
                    resolve(prevRentals);
                },
                error => {
                console.log(error);
                reject(error);
                }
            );
        });
        }
   }
   async removePrevRental(prevRentalId: number){
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        // Need to pass in the home ID into this!
      return new Promise((resolve, reject) => { this.http
          .delete<IPreviousRental>(`${this.prevRentalsUrl}/${prevRentalId}`, options).subscribe(
              prevRental => {
                resolve(prevRental);
              },
              error => {
                reject(error);
              }
          )
      });
    }
  }
   async updatePrevRental(prevRental: IPreviousRental){
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
      return new Promise((resolve, reject) => { this.http
          .put<IPreviousRental>(`${this.prevRentalsUrl}/${prevRental.Id}`, prevRental, options).subscribe(
            prevRental => {
                resolve(prevRental);
              },
              error => {
                reject(error);
              }
          )
      });
    }
}
}