import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IHome} from '../interfaces/Homes';


@Injectable({
    providedIn: 'root'
})

export class HomesService{
  private homesUrl = 'http://localhost:64097/api/Homes';
  currToken : AToken;
  homes: Iterable<IHome>;

  constructor(private http: HttpClient){
  }

  getHomes(): Promise<Iterable<IHome>>{
    return new Promise((resolve, reject) => {

      this.fetchHomes().then((homes: Iterable<IHome>) => {
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
              console.log("Home post to API was unsuccessful.");
              console.log(error);
              reject(error);
            }
        );
      });
    }
  }
}