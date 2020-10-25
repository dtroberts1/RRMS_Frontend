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
                   // Get some logic for response (should just return id back for newly added home)'
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
                    console.log("Resolving with " + JSON.stringify(prospects));
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
   }
   async updateProspect(prospect: IProspect){
    // Important: room should already have a homeId at this point!
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        // Need to pass in the home ID into this!
      return new Promise((resolve, reject) => { this.http
          .put<IProspect>(`${this.prospectsUrl}/${prospect.Id}`, prospect, options).subscribe(
              prospect => {
                resolve(prospect);
              },
              error => {
                reject(error);
              }
          )
      });
    }
}
async removeProspect(prospectId: number){
  // Important: room should already have a homeId at this point!
  // Get token from localStorage
  this.currToken = JSON.parse(localStorage.getItem('user'));
  if (this.currToken != null){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', "bearer " + this.currToken),
      };
      // Need to pass in the home ID into this!
    return new Promise((resolve, reject) => { this.http
        .delete<IProspect>(`${this.prospectsUrl}/${prospectId}`, options).subscribe(
            prospect => {
              // Get some logic for response (should just return id back for newly added room)
              resolve(prospect);
            },
            error => {
              reject(error);
            }
        )
    });
  }
}
}

enum ProspectStatus {
    approved = 1,
    declined = 2,
    pending = 3,
  }