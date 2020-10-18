import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {IHome} from '../../../interfaces/Homes';
import { AddRoomModalComponent } from '../../room/add-room-modal/add-room-modal.component';
import { ViewRoomComponent } from '../../room/view-room/view-room.component';

@Component({
  selector: 'app-home-details',
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.css']
})
export class HomeDetailsComponent implements OnInit {
  @Input() home : IHome;
  roomCount: number;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog, 
    private router: Router,
    ) { 

    }

  ngOnInit(): void {
    this.roomCount = (<any[]>this.home.Rooms)?.length;
  }
  openViewRoomDialog(){
    console.log("in home details, about to send " + JSON.stringify(this.home.Rooms));
    this.dialog.open(ViewRoomComponent, {
      data: {
        home : this.home,
        rooms : this.home.Rooms,
      },
      width:'45%',
      height: '55%'
    }).afterClosed().subscribe(() => {

    });
  }
  openViewProspectDialog(){

  }
  addProspect(){
    
  }
  addRoom(){
    console.log("in home details, about to send " + JSON.stringify(this.home.Rooms));
    this.dialog.open(AddRoomModalComponent, {
      data: {
        home : this.home,
        rooms : this.home.Rooms,
      },
      width:'45%',
      height: '45%'
    }).afterClosed().subscribe(() => {

    });
  }
}
