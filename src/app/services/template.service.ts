import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IEmployer} from '../interfaces/Employer';

@Injectable({
    providedIn: 'root'
})

export class TemplateService{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    employers: Iterable<IEmployer>;
    private templatesUrl = 'http://localhost:64097/api/Templates';

    constructor(private http: HttpClient){
    }
    async createTemplate(templateParam: any){
          // Get token from localStorage
          this.currToken = JSON.parse(localStorage.getItem('user'));
          if (this.currToken != null){
            let options = {
              headers: new HttpHeaders().set('Content-Type', 'application/json')
              .set('Authorization', "bearer " + this.currToken),
              };
              // Need to pass in the home ID into this!
            return new Promise((resolve, reject) => { this.http
                .post(`${this.templatesUrl}/CreateTemplate`, templateParam, options).subscribe(
                    sfdt => {
                      // Returns Syncfusion Document Text
                      resolve(sfdt);
                    },
                    error => {
                      reject(error);
                    }
                )
            });
          }
    }

    async getTemplate(fileName: string){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .get(`${this.templatesUrl}/ImportTemplate/${fileName}`,options).subscribe(
                sfdt => {
                  // Returns Syncfusion Document Text
                  resolve(sfdt);
                },
                error => {
                  reject(error);
                }
            )
        });
      }
    }
/*
    async saveEmployer(employer: IEmployer){
     // Get token from localStorage
     console.log("in saveEmployer, about to send" + JSON.stringify(employer));
     this.currToken = JSON.parse(localStorage.getItem('user'));
     if (this.currToken != null){
       let options = {
         headers: new HttpHeaders().set('Content-Type', 'application/json')
         .set('Authorization', "bearer " + this.currToken),
         };
       return new Promise((resolve, reject) => { this.http
           .post<IEmployer>(this.employersUrl, employer, options).subscribe(
            employer => {
                   resolve(employer);
               },
               error => {
                 reject(error);
               }
           )
       });
     }
    }
*/
}