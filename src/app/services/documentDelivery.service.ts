import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IEmployer} from '../interfaces/Employer';
import { IProspect } from '../interfaces/Prospect';
import {IDocumentProspectDto} from '../interfaces/DocumentProspect';
import { IEmailedLeaseDocMessage } from '../interfaces/EmailedLeaseDocMessage';
import { IDocumentDeliveries } from '../interfaces/DocumentDeliveries';
import { catchError, last, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DocumentDeliveryService{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    private documentDeliveryUrl = 'http://localhost:64097/api/DocumentDeliveries';

    constructor(private http: HttpClient){
    }
    async GetDocumentDeliveries(documentId: number){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
          // Need to pass in the home ID into this!
        return new Promise((resolve, reject) => { this.http
            .get(`${this.documentDeliveryUrl}/GetDocumentDeliveries/${documentId}`,options).subscribe(
                (documentDeliveries: Iterable<IDocumentDeliveries>) => {
                  // Returns Syncfusion Document Text
                  resolve(documentDeliveries);
                },
                error => {
                  reject(error);
                }
            )
        });
      }
    }
    async DeliverAddRecordCustom(fd: FormData) {
      let token = JSON.parse(localStorage.getItem('user'));
      let options = {
        headers: new HttpHeaders()
        .set('Authorization', "bearer " + token),
        };
     // const req = new HttpRequest('POST', `${this.documentDeliveryUrl}/DeliverAddRecordCustom`, fd, options)
      return new Promise((resolve, reject) => { this.http
        .post(`${this.documentDeliveryUrl}/DeliverAddRecordCustom`, fd, options).subscribe(
         result => {
                // Get some logic for response (should just return id back for newly added home)'
                console.log("result is " + result);
                resolve(result);
            },
            error => {
                console.log("error is " + JSON.stringify(error));
              reject(error);
            }
        )
    });
      /*;

      this.http.request(req).pipe(
            map(event => {
                  switch (event.type) {
                        case HttpEventType.UploadProgress:
                              break;
                        case HttpEventType.Response:
                              return event;
                  }
            }),
            tap(message => { }),
            last(),
            catchError((error: HttpErrorResponse) => {
                  return of(`${fd.get('LocalFileName').toString()} upload failed.`);
            })
      );
      //fd.delete('LocalFileName');    
      */
    }
    async DeliverAddRecord(docMessage: IEmailedLeaseDocMessage){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
        return new Promise((resolve, reject) => { this.http
            .post<number>(`${this.documentDeliveryUrl}/DeliverAddRecord`, docMessage, options).subscribe(
             result => {
                    // Get some logic for response (should just return id back for newly added home)'
                    console.log("result is " + result);
                    resolve(result);
                },
                error => {
                    console.log("error is " + JSON.stringify(error));
                  reject(error);
                }
            )
        });
      }
    }
}