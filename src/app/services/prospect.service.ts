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
    public prospects: Iterable<IProspect>;
    private prospectsUrl = 'http://localhost:64097/api/Prospects';
    availableProspects : Iterable<IProspect>;
    constructor(private http: HttpClient){
      
    }

    async saveProspect(prospect: IProspect){
     // Get token from localStorage
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
    
    async getProspects(): Promise<Iterable<IProspect>>{
      // First, asynchronously call getAvailableProspects
      this.getAvailableProspects();

        // Also return all prospects
        return new Promise((resolve, reject) => {
          this.fetchProspects().then((prospects: Iterable<IProspect>) => {
            this.prospects = prospects;
            resolve(this.prospects);
          }).catch((err) => {
            reject(err);
          });
        });
      }

   async fetchProspects(){
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
                    resolve(prospects);
                },
                error => {
                console.log("Fetch() was unsuccessful.");
                reject(error);
                }
            );
        });
      }      
   }
   async getProspect(prospectId: number){
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        return new Promise((resolve, reject) => { this.http
          .get<IProspect>(`${this.prospectsUrl}/${prospectId}`, options).subscribe(
              (prospect: IProspect) => {
                resolve(prospect);
              },
              error => {
                reject(error);
              }
          )
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

  // Gets available rooms that are not "occupied" (where the rooms don't have a prospect with status > 4)
  async getAvailableProspects(): Promise<Iterable<IProspect>>{
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        return new Promise((resolve, reject) => { this.http
          .get<Iterable<IProspect>>(`${this.prospectsUrl}/GetAvailableProspects`, options).subscribe(
              (prospects: Iterable<IProspect>) => {

                // These prospects will have a status < 5
                this.availableProspects = prospects;
                // Get some logic for response (should just return id back for newly added room)
                resolve(this.availableProspects);
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
  pendingLandlordDecision = 3,
  pendingLeaseSignature = 4,
  leaseSigned = 5,
  inBilling = 6,
  }