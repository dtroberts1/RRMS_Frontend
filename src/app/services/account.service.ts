import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {Landlord} from '../interfaces/Landlord'

@Injectable({
    providedIn: 'root'
})

export class AccountService{
    private accountURL = 'http://localhost:64097/api/Accounts/1';
    private landlordsURL = 'http://localhost:64097/api/Landlords';

    constructor(private http: HttpClient){}
    /*
    getAccounts() : Observable<any[]>{
        // IAccount -- set this up as well as observable
        return this.http.get<any[]>(this.accountURL).pipe(
            tap(data => console.log('All: '+ JSON.stringify(data))),
            catchError(this.handleError)
        );
    }
    */

    postLandlord(landlord: Landlord) : Observable<Landlord>{
    return this.http.post<Landlord>(this.landlordsURL, landlord).pipe(
        catchError(this.handleError))
    }

    private handleError(err: HttpErrorResponse){
        let errorMessage = '';
        if (err.error instanceof ErrorEvent){
            // a Client-side or network related error occured. Handle it accordingly.
            errorMessage = `An Error occured: ${err.message};`
        }
        else{
            errorMessage = `Server returned code: ${err.status}, error message is ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}