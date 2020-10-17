import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {AToken} from '../interfaces/Token';
import{IRoom} from '../interfaces/Rooms';


@Injectable({
    providedIn: 'root'
})

export class RoomsService{
  private roomsUrl = 'http://localhost:64097/api/Rooms';
  currToken : AToken;
  rooms: Iterable<IRoom>;

  constructor(private http: HttpClient){
  }

  getRooms(homeId: number): Promise<Iterable<IRoom>>{
    return new Promise((resolve, reject) => {

      this.fetchRooms(homeId).then((rooms: Iterable<IRoom>) => {
        this.rooms = rooms;
        resolve(this.rooms);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async createRoom(room: IRoom){
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
            .post<IRoom>(this.roomsUrl, room, options).subscribe(
                room => {
                    // Get some logic for response (should just return id back for newly added room)
                    resolve(room);
                },
                error => {
                  reject(error);
                }
            )
        });
      }
  }
  fetchRooms(homeId: number){  
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
        .get<Iterable<IRoom>>(this.roomsUrl, options).subscribe(
            rooms => {
                // Get some logic for response (should just return id back for newly added room)
                resolve(rooms);
            },
            error => {
              console.log("Room post to API was unsuccessful.");
              console.log(error);
              reject(error);
            }
        );
      });
    }
  }
}