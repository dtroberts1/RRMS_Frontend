import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from 'src/app/interfaces/Rooms';
import { RoomsService } from 'src/app/services/room.service';
import { HomesService } from '../../../services/homes.service';
import { ProspectService } from '../../../services/prospect.service';

import { IHome } from '../../../interfaces/Homes';
import { AddRoomModalComponent } from '../../room/add-room-modal/add-room-modal.component';
import { ViewRoomComponent } from '../../room/view-room/view-room.component';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { IProspect } from 'src/app/interfaces/Prospect';
import { AddApprovedProspectComponentModal } from '../../room/add-approved-prospect/add-approved-prospect.component';
import { RemoveRoomModalComponent } from '../remove-room-modal/remove-room-modal.component';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
interface AvailableRoomsAndProspects {
  availRooms: Iterable<IRoom>,
  availProspects: Iterable<IProspect>,
}
@Component({
  selector: 'app-home-details',
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.scss']
})
export class HomeDetailsComponent implements OnInit {
  @Input() home: IHome;
  modalRef: MDBModalRef;
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
    private homeService: HomesService,
    private prospectService: ProspectService,
    private modalService: MDBModalService,
  ) {
  }
  async ngOnChanges(changes: SimpleChanges) {
    this.roomCount = (<any[]>this.home.Rooms)?.length;
    await this.roomsService.getAvailableRooms(this.home.Id).then((rooms: Iterable<IRoom>) => {
      this.availRooms = rooms;
    });
  }


  async ngOnInit() {
    if (this.home != null) {
      this.roomCount = (<any[]>this.home.Rooms)?.length;
      if (this.prospectService.availableProspects == null) {
        await this.prospectService.getAvailableProspects().then((availProspects: Iterable<IProspect>) => {
          this.availProspects = availProspects;
        })
      }
      else {
        this.availProspects = this.prospectService.availableProspects;
      }
    }
    else {
      this.roomCount = 0;
    }
  }

  removeRoomBtnClicked() {
    console.log("opening remove room dialog");
    if (this.home != null) {
      this.modalRef = this.modalService.show(RemoveRoomModalComponent, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          home: this.home,
        },
      });
      this.modalRef.content.action.subscribe((roomRemoved: boolean) => {
        this.modalRef.hide();
        if (roomRemoved == true) {
          // Get updated list of rooms for the home
          if (this.home != null) {
            this.roomsService.getRooms(this.home.Id).then((rooms: Iterable<IRoom>) => {
              this.home.Rooms = rooms;
              this.roomCount = (<any[]>this.home.Rooms)?.length;
            })
          }
        }
      },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
    }
  }

  openViewRoomDialog() {
    if (this.home != null) {
      this.modalRef = this.modalService.show(ViewRoomComponent, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          home: this.home,
          rooms: this.home.Rooms,
        }});
        this.modalRef.content.action.subscribe((home: IHome)=> {
          this.modalRef.hide();
          this.home.Rooms = home.Rooms;
          this.roomCount = (<any[]>this.home.Rooms)?.length;
        },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
      }
  }
    openViewProspectDialog(){

    }
    async openAddProspectDialog(){
      this.roomsService.getAvailableRooms(this.home.Id).then((rooms: Iterable<IRoom>) => {
        this.availRooms = rooms;
        this.modalRef = this.modalService.show(AddApprovedProspectComponentModal, {
          backdrop: true,
          keyboard: true,
          focus: true,
          show: false,
          ignoreBackdropClick: false,
          class: '',
          containerClass: '',
          animated: true,
          data: {
            availRooms: this.availRooms,
            availProspects: this.availProspects,
          }
        });
        this.modalRef.content.action.subscribe(() => {
          this.modalRef.hide();

        },
          error => {
            console.log(error);
            this.modalRef.hide();
          });
      })
        .catch((err) => {
          this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
            backdrop: true,
            keyboard: true,
            focus: true,
            show: false,
            ignoreBackdropClick: false,
            class: '',
            containerClass: '',
            animated: true,
            data: {
              inError: true,
              title: "Unable to process",
              contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
              errorItems: []
            }
          });
          this.modalRef.content.action.subscribe(() => {
            this.modalRef.hide();
          },
            error => {
              console.log(error);
              this.modalRef.hide();
            });
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
      this.modalRef = this.modalService.show(AddRoomModalComponent, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          home: this.home,
          rooms: this.home.Rooms,
        },
      });
      this.modalRef.content.action.subscribe((home: IHome) => {
        this.modalRef.hide();
        this.home.Rooms = home.Rooms;
        this.roomCount = (<any[]>this.home.Rooms)?.length;
      },
        error => {
          console.log(error);
          this.modalRef.hide();
        });
    }
  }
