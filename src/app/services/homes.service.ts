import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IHome} from '../interfaces/Homes';
import { IRoom } from '../interfaces/Rooms';


@Injectable({
    providedIn: 'root'
})

export class HomesService{
  private homesUrl = 'http://localhost:64097/api/Homes';
  currToken : AToken;
  homes: Iterable<IHome>;

  constructor(private http: HttpClient){
  }

  removeHome(homeId: number): Promise<IHome>{
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
          .delete<IHome>(`${this.homesUrl}/${homeId}`, options).subscribe(
              home => {
                resolve(home);
              },
              error => {
                reject(error);
              }
          )
      });
    }
}

  getHome(homeId: number): Promise<IHome>{
      // This does not include all of the rooms with the home!!

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
            .get<IHome>(`${this.homesUrl}/${homeId}`, options).subscribe(
                home => {
                  resolve(home);
                },
                error => {
                  reject(error);
                }
            )
        });
      }
  }

  async getRoomsAssignedToHome(homeId: number){
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        // Need to pass in the home ID into this!
      return new Promise((resolve, reject) => { this.http
          .get<Iterable<IRoom>>(`${this.homesUrl}/GetRoomsAssignedToHome/${homeId}`, options).subscribe(
              rooms => {
                // Get some logic for response (should just return id back for newly added room)
                resolve(rooms);
              },
              error => {
                reject(error);
              }
          )
      });
    }
  }

  getHomes(): Promise<Iterable<IHome>>{
    return new Promise((resolve, reject) => {

      this.fetchHomes()?.then((homes: Iterable<IHome>) => {
        this.homes = homes;
        resolve(this.homes);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async createHome(home: IHome){
      // Get token from localStorage
      this.currToken = JSON.parse(localStorage.getItem('user'));
      if (this.currToken != null){
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', "bearer " + this.currToken),
          };
        return new Promise((resolve, reject) => { this.http
            .post<IHome>(this.homesUrl, home, options).subscribe(
                home => {
                    // Get some logic for response (should just return id back for newly added home)
                    resolve(home);
                },
                error => {
                  reject(error);
                }
            )
        });
      }
  }
  fetchHomes(){  
  // Get token from localStorage
  this.currToken = JSON.parse(localStorage.getItem('user'));
  if (this.currToken != null){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', "bearer " + this.currToken),
      };
    //options.headers.append('Authorization', JSON.stringify(this.currToken));
    return new Promise((resolve, reject) => {
      this.http
        .get<Iterable<IHome>>(this.homesUrl, options).subscribe(
            homes => {
                // Get some logic for response (should just return id back for newly added home)
                resolve(homes);
            },
            error => {
              console.log(error);
              reject(error);
            }
        );
      });
    }
  }
}