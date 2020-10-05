import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {User, LoginUser} from '../interfaces/User'
import {AToken} from '../interfaces/Token';
import { HomesService } from './homes.service';


@Injectable({
    providedIn: 'root'
})

export class AccountService{
    private accountURL = 'http://localhost:64097/api/Accounts/1';
    private landlordsURL = 'http://localhost:64097/api/Landlords';
    private regURL = 'http://localhost:64097/api/Account/Register';
    private tokenURL = 'http://localhost:64097/token';


    constructor(private http: HttpClient, private homesService: HomesService){}
    /*
    getAccounts() : Observable<any[]>{
        // IAccount -- set this up as well as observable
        return this.http.get<any[]>(this.accountURL).pipe(
            tap(data => console.log('All: '+ JSON.stringify(data))),
            catchError(this.handleError)
        );
    }
    */
    register(user : User){
      return new Promise((resolve, reject) => {
        this.http.post<User>(this.regURL, user).subscribe(
          data => {
            console.log("Result of register is " + JSON.stringify(data));
            resolve();
          },
          error =>{
            console.log("error on register: " + JSON.stringify(error));
            reject(error);
          }
        )
      });
    }

   async login(user: LoginUser){
    let body = `grant_type=password&username=${user.username} &password=${user.password}`;
    console.log("body is " + body);
    //new URLSearchParams(); 
    //body.set('user', user.username);
    //body.set('password', user.password);
    
    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return new Promise((resolve, reject) => { this.http
        .post<AToken>(this.tokenURL, body.toString(), options).subscribe(
            data => {
                localStorage.setItem('user', JSON.stringify(data.access_token));
                this.homesService.fetchHomes();
                  // If token is valid, login
                  console.log("localStorage is " + JSON.parse(localStorage.getItem('user')));
                  resolve();
              },
            error => {
              console.log("Can't go to dashboard. invalid login");
              console.log(error);
              reject(error);
            }
        )
        });
    }

    private handleError(error: HttpErrorResponse) {

        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
            localStorage.clear();
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
      }
}