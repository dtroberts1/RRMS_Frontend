import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IEmployer} from '../interfaces/Employer';
import { IProspect } from '../interfaces/Prospect';
import {IDocumentProspectDto} from '../interfaces/DocumentProspect';
import { IEmailedLeaseDocMessage } from '../interfaces/EmailedLeaseDocMessage';

@Injectable({
    providedIn: 'root'
})

export class DocumentDeliveryService{
    private tokenURL = 'http://localhost:64097/token';
    currToken : AToken;
    private documentDeliveryUrl = 'http://localhost:64097/api/DocumentDeliveries';

    constructor(private http: HttpClient){
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