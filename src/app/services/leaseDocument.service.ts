import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IEmployer} from '../interfaces/Employer';
import { IProspect } from '../interfaces/Prospect';
import {IDocumentProspectDto} from '../interfaces/DocumentProspect';

@Injectable({
    providedIn: 'root'
})

export class LeaseDocumentService{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    private leaseDocumentsUrl = 'http://localhost:64097/api/LeaseDocuments';

    constructor(private http: HttpClient){
    }

    async getDocumentUsingConfCode(docDeliveryConfCode: number){
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
        return new Promise((resolve, reject) => { this.http
            .get<IProspect>(`${this.leaseDocumentsUrl}/GetDocumentUsingConfCode/${docDeliveryConfCode}`, options).subscribe(
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

    async removeLeaseDocument(leaseDocId: number){
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
        return new Promise((resolve, reject) => { this.http
            .delete<IProspect>(`${this.leaseDocumentsUrl}/RemoveLeaseDocument/${leaseDocId}`, options).subscribe(
             document => {
                    // Get some logic for response (should just return id back for newly added home)'
                    resolve(document);
                },
                error => {
                  reject(error);
                }
            )
        });
      }
    }
    
    async getDocument(fileName: string, prospectId: number){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .get(`${this.leaseDocumentsUrl}/ImportDocument/${fileName}/${prospectId}`,options).subscribe(
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
    async getDocumentProspectDtos(){
            // Get token from localStorage
            this.currToken = JSON.parse(localStorage.getItem('user'));
            if (this.currToken != null){
              let options = {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
                .set('Authorization', "bearer " + this.currToken),
                };
                // Need to pass in the home ID into this!
              return new Promise((resolve, reject) => { this.http
                  .get(`${this.leaseDocumentsUrl}/GetDocumentProspects`,options).subscribe(
                      (documentProspectList: Iterable<IDocumentProspectDto>) => {
                        // Returns Syncfusion Document Text
                        resolve(documentProspectList);
                      },
                      error => {
                        reject(error);
                      }
                  )
              });
            }
    }

    async updateDocument(documentParam: any, fileName: string, prospectId : number){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          console.log("Before sending off, fileName is " + fileName + ", and prospect id is " + prospectId);
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .post(`${this.leaseDocumentsUrl}/UpdateLeaseDocument/${fileName}/${prospectId}`, documentParam, options).subscribe(
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
    async addDocument(sfdt: any,prospect: IProspect, fileName : string){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          console.log("about to send through: filename: " + fileName + " prospect: " + prospect + " and sfdt: " + JSON.stringify(sfdt));
        return new Promise((resolve, reject) => { this.http
            .post<IProspect>(`${this.leaseDocumentsUrl}/CreateLeaseDocument/${fileName}/${prospect.Id}`, sfdt, options).subscribe(
             documentId => {
                    // Get some logic for response (should just return id back for newly added home)'
                    resolve(documentId);
                },
                error => {
                  reject(error);
                }
            )
        });
      }
    }
}