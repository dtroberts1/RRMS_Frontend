import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IEmployer} from '../interfaces/Employer';

@Injectable({
    providedIn: 'root'
})

export class EmployerService{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    employers: Iterable<IEmployer>;
    private employersUrl = 'http://localhost:64097/api/Employers';

    constructor(private http: HttpClient){
    }

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

    getEmployers(): Promise<Iterable<IEmployer>>{
        return new Promise((resolve, reject) => {
    
          console.log("in getEmployers, employers is " + this.employers);
          this.fetchEmployers().then((employers: Iterable<IEmployer>) => {
            this.employers = employers;
            resolve(this.employers);
          }).catch((err) => {
            reject(err);
          });
        });
      }

   fetchEmployers(){
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
        let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        return new Promise((resolve, reject) => {
        this.http
            .get<Iterable<IEmployer>>(this.employersUrl, options).subscribe(
                employers => {
                    resolve(employers);
                },
                error => {
                console.log("Employer post to API was unsuccessful.");
                console.log(error);
                reject(error);
                }
            );
        });
        }
   }
   async removeEmployer(empId: number){
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        // Need to pass in the home ID into this!
      return new Promise((resolve, reject) => { this.http
          .delete<IEmployer>(`${this.employersUrl}/${empId}`, options).subscribe(
              emp => {
                resolve(emp);
              },
              error => {
                reject(error);
              }
          )
      });
    }
  }
   async updateEmployer(employer: IEmployer){
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
      return new Promise((resolve, reject) => { this.http
          .put<IEmployer>(`${this.employersUrl}/${employer.Id}`, employer, options).subscribe(
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
}