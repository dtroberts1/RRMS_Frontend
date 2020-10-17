import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {RoomsService} from '../../services/room.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  dimension1 : FormControl = new FormControl('', [Validators.pattern('[a-zA-Z\\s]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[a-zA-Z\\s]{1,3}')]);
  monthlyRateInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,5}')]);
  isMaster : boolean = false;
  hasCloset : boolean = false;
  hasCeilingFan : boolean = false;
  hasPrivateBath : boolean = false;

  homeID : number;
  nickname : string;
  checked : boolean = false;
  nbrRooms : number;
  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,    
    ) { }

  ngOnInit(): void {
    if (this.route.queryParams != null){
      this.route.queryParams.subscribe(queryParams => {
        // do something with the query params
      });
      this.route.params.subscribe(routeParams => {
        if (routeParams.id != undefined)
        {
          this.homeID = routeParams.id;
          this.nickname = routeParams.nickname;
          this.nbrRooms = routeParams.nbrRooms;

        }
      });
    }
  }

  saveRoom(){
    console.log("about to save with HomeId = ", this.homeID);
    this.roomsService.createRoom({
      RoomName: this.nickname,
      Dimensions: `${this.dimension1.value} x ${this.dimension2.value}`,
      IsMaster: this.isMaster,
      HasCloset: this.hasCloset,
      HasCeilingFan: this.hasCeilingFan,
      HasPrivateBath: this.hasPrivateBath,
      MonthlyRate: this.monthlyRateInput.value,
      HomeId: this.homeID,
    });
  }
  getInputErrorMessage(inputField){
    
    if (inputField.hasError('required')) {
      return 'You must enter a value';
    }
    if (inputField.hasError(inputField)){
        return "Not a valid entry";
    }
    
  }
}
