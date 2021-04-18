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
  availableRoomsForRent: Iterable<IRoom>

  constructor(private http: HttpClient){
  }
  getRooms(homeId: number){
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        // Need to pass in the home ID into this!
      return new Promise((resolve, reject) => { this.http
          .get(`${this.roomsUrl}/GetRooms/${homeId}`,options).subscribe(
              (rooms: Iterable<IRoom>) => {
                // Returns Syncfusion Document Text
                resolve(rooms);
              },
              error => {
                reject(error);
              }
          )
      });
    }
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
  async getRoom(roomId: number){
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
          .get<IRoom>(`${this.roomsUrl}/${roomId}`, options).subscribe(
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
  // Gets available rooms that are not "occupied" (where the rooms don't have a prospect with status > 4)
  async getAvailableRooms(houseId: number): Promise<Iterable<IRoom>>{
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        return new Promise((resolve, reject) => { this.http
          .get<Iterable<IRoom>>(`${this.roomsUrl}/getAvailableRooms/${houseId}`, options).subscribe(
              rooms => {
                this.availableRoomsForRent = rooms;
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

  async updateRoom(room: IRoom){
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
          .put<IRoom>(`${this.roomsUrl}/${room.Id}`, room, options).subscribe(
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
async getProspectsAssignedToRoom(roomId: number){
    // Get token from localStorage
    this.currToken = JSON.parse(localStorage.getItem('user'));
    if (this.currToken != null){
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', "bearer " + this.currToken),
        };
        // Need to pass in the home ID into this!
      return new Promise((resolve, reject) => { this.http
          .get<IRoom>(`${this.roomsUrl}/GetProspectsAssignedToRoom/${roomId}`, options).subscribe(
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

async removeRoom(roomId: number){
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
        .delete<IRoom>(`${this.roomsUrl}/${roomId}`, options).subscribe(
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
}