import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from 'src/app/interfaces/Rooms';
import { RoomsService } from 'src/app/services/room.service';
import {HomesService} from '../../../services/homes.service';
import {IHome} from '../../../interfaces/Homes';
import { AddRoomModalComponent } from '../../room/add-room-modal/add-room-modal.component';
import { ViewRoomComponent } from '../../room/view-room/view-room.component';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home-details',
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.css']
})
export class HomeDetailsComponent implements OnInit {
  @Input() home : IHome;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  roomCount: number;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog, 
    private router: Router,
    private roomsService: RoomsService,
    private HomesService: HomesService,
    ) { 

    }
  ngOnChanges(changes: SimpleChanges): void{
    this.roomCount = (<any[]>this.home.Rooms)?.length;
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
    }).afterClosed().subscribe((home: IHome) => {
        this.home.Rooms = home.Rooms;
        this.roomCount = (<any[]>this.home.Rooms)?.length;
    });
  }
  openViewProspectDialog(){

  }
  addProspect(){
    console.log("houseDetails are :" + JSON.stringify(this.home));
    /*
    this.roomsService.getAvailableRooms(1).then((rooms : Iterable<IRoom>) => {
      console.log("Rooms from request are " + JSON.stringify(rooms));
    });
    */
  }

  hasRooms(){
    if (this.roomCount > 0)
      return true;
    else
      return false;
  }

  dispRoomCount(){
    if (this.roomCount == 0 || this.roomCount > 1)
      return `${this.roomCount} Rooms`;
    else if (this.roomCount == 1)
      return `${this.roomCount} Room`;
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
    }).afterClosed().subscribe((home : IHome) => {
        this.home.Rooms = home.Rooms;
        this.roomCount = (<any[]>this.home.Rooms)?.length;

    },
    err => {
      console.log(err);
    });
  }
}
