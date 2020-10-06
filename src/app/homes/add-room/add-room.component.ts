import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  dimension1 : FormControl = new FormControl('', [Validators.pattern('[a-zA-Z\\s]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[a-zA-Z\\s]{1,3}')]);
  monthlyRateInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[\d]{1,5}')]);
  isMaster : boolean = false;
  hasCloset : boolean = false;
  hasCeilingFan : boolean = false;
  hasPrivateBath : boolean = false;

  homeID : number;
  nickname : string;
  checked : boolean = false;
  nbrRooms : number;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.queryParams != null){
      this.route.queryParams.subscribe(queryParams => {
        // do something with the query params
        console.log("queryParams: " + queryParams.id);
      });
      this.route.params.subscribe(routeParams => {
        if (routeParams.id != undefined)
        {
          this.homeID = routeParams.id;
          this.nickname = routeParams.nickname;
          this.nbrRooms = routeParams.nbrRooms;

          console.log("homeID: " + this.homeID + 
          ", nickname: " + this.nickname + 
          "Room #: " + this.nbrRooms + 1);
        }
      });
    }
  }

  saveRoom(){
    
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
