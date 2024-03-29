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

    async getAvailableCustomTemplateFileNames(){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .get(`${this.templatesUrl}/GetAvailableCustomTemplateFileNames`,options).subscribe(
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
    async deleteTemplate(fileName: string){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .delete(`${this.templatesUrl}/DeleteTemplate/${fileName}`, options).subscribe(
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
    async updateCustomTemplate(templateParam: any, fileName: string){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .put(`${this.templatesUrl}/UpdateTemplate/${fileName}`, templateParam, options).subscribe(
                sfdt => {
                  // Returns Syncfusion Document Text
                  resolve(true); // return 0 to indicate the request went through
                },
                error => {
                  if(error.status == 404){
                    console.log("status is 404");
                    resolve(404)
                  }
                  else if(error.status == 0){
                    resolve(true);
                  }
                  else{
                    reject(error);
                  }
                }
            )
        });
      }
    }

    async createCustomTemplate(templateParam: any, fileName: string){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .post(`${this.templatesUrl}/CreateCustomTemplate/${fileName}`, templateParam, options).subscribe(
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
    async createTemplate(templateParam: any, stateName: string){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .post(`${this.templatesUrl}/CreateTemplate/${stateName}`, templateParam, options).subscribe(
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
    async getStateRLATemplates(state: string){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .get(`${this.templatesUrl}/GetStateRLATemplates/${state}`,options).subscribe(
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
}