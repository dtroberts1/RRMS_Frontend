import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from 'src/app/interfaces/Rooms';
import { RoomsService } from 'src/app/services/room.service';
import {HomesService} from '../../../services/homes.service';
import {ProspectService} from '../../../services/prospect.service';

import {IHome} from '../../../interfaces/Homes';
import { AddRoomModalComponent } from '../../room/add-room-modal/add-room-modal.component';
import { ViewRoomComponent } from '../../room/view-room/view-room.component';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { IProspect } from 'src/app/interfaces/Prospect';
import { AddApprovedProspectComponentModal } from '../../room/add-approved-prospect/add-approved-prospect.component';
interface AvailableRoomsAndProspects{
  availRooms: Iterable<IRoom>,
  availProspects: Iterable<IProspect>,
}
@Component({
  selector: 'app-home-details',
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.css']
})
export class HomeDetailsComponent implements OnInit {
  @Input() home : IHome;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  availRooms = null;
  roomCount: number;
  availProspects: Iterable<IProspect>;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog, 
    private router: Router,
    private roomsService: RoomsService,
    private prospectService: ProspectService,
    ) { 
    }
  async ngOnChanges(changes: SimpleChanges){
    this.roomCount = (<any[]>this.home.Rooms)?.length;
    await this.roomsService.getAvailableRooms(this.home.Id).then((rooms : Iterable<IRoom>) => {
      console.log("Available Rooms are are " + JSON.stringify(rooms));
      this.availRooms = rooms;
    });
  }


  async ngOnInit() {
    if (this.home != null){
        this.roomCount = (<any[]>this.home.Rooms)?.length;
        if (this.prospectService.availableProspects == null){
          await this.prospectService.getAvailableProspects().then((availProspects: Iterable<IProspect>) => {
            this.availProspects = availProspects;
          })
        }
        else{
          this.availProspects = this.prospectService.availableProspects; 
        }
      }
      else{
        this.roomCount = 0;
      }
    }


  openViewRoomDialog(){
    if (this.home != null){
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
  }
  openViewProspectDialog(){

  }
  async openAddProspectDialog(){
    console.log("availProspects are :" + JSON.stringify(this.availProspects));
      this.roomsService.getAvailableRooms(this.home.Id).then((rooms : Iterable<IRoom>) => {
        console.log("Available Rooms are are " + JSON.stringify(rooms));
        this.availRooms = rooms;
        this.dialog.open(AddApprovedProspectComponentModal, {
          data: {
            availRooms: this.availRooms,
            availProspects: this.availProspects,
          },
          width:'18%',
          height: '55%'
        }).afterClosed().subscribe(() => {
    
        },
          err =>{
            console.log(err);
          }
        );
      });
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
