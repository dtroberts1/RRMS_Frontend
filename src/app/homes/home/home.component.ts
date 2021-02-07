import { Component, Input, OnInit } from '@angular/core';
import {HomesService} from '../../services/homes.service';
import{IHome} from '../../interfaces/Homes';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from 'src/app/interfaces/Rooms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() myHome : IHome;
  latitude: number;
  longitude: number;
  zoom:number;
  paramsId = -1;
  individualView: boolean = false; // If true, it will be displayed by itself in the UI view,
  modalRef: MDBModalRef;
  // not as a list item of "Homes"
  constructor(private route: ActivatedRoute, 
    private homesService: HomesService,
    public dialog: MatDialog, 
    private router: Router,
    private modalService: MDBModalService,

    ) { 
    this.homesService = homesService;
  }

  removeHome(){
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
        inError: false,
        title: "Delete - Are you sure?",
        contentSummary: "Are you sure you would like to delete this home?",
        errorItems: []
      }
    });
    this.modalRef.content.action.subscribe((deleteHome: boolean)=> {
      this.modalRef.hide();
      if (deleteHome == true){
        if (this.myHome.Rooms != null && (<any[]>this.myHome.Rooms).length > 0){
          // If there are rooms assigned to this house, prompt the user (let them know which rooms).
          // Do not remove the rooms from the home. Let the user remove the rooms manually
          let roomNameStr : string[] = new Array<string>();
          (<any[]>this.myHome.Rooms).forEach((room: IRoom) => {
            roomNameStr.push(room.RoomName);
          })
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
              title: "Unable To Delete",
              contentSummary: `The following rooms are linked to this house and will need to first be removed:`,
              errorItems: roomNameStr,
            }
          })
          this.modalRef.content.action.subscribe(()=> {
            this.modalRef.hide();
          },
          error => {
          console.log(error);
          this.modalRef.hide();
          });
        }
        else{
          // It's safe to remove home
          // Call Service to remove the home
          this.homesService.removeHome(this.myHome.Id)
            .then(() => {
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
                  title: "Home Deleted",
                  contentSummary: `Home ${this.myHome.Nickname} has been Removed`,
                  errorItems: []
                }
              });
              this.modalRef.content.action.subscribe(result => {
                this.modalRef.hide();
                this.router.navigate(['./dashboard']);
              },
              error => {
                console.log(error);
                this.modalRef.hide();
              });
            })
            .catch(() =>{
              // Use our 'we're sorry.. our blablabla
            })
    
          // Then redirect to homes
        }
      }
    },
    error => {
      console.log(error);
      this.modalRef.hide();
    });
  }

  ngOnInit(): void {
    if (this.route.queryParams != null){
      this.route.queryParams.subscribe(queryParams => {
        // do something with the query params
      });
      this.route.params.subscribe(params => {
        if (params.id != undefined)
        {
          if (this.homesService.homes == null){
            this.homesService.getHomes().then((homes : Iterable<IHome>) => {
              this.myHome = homes[params.id - 1];
              this.individualView = true;
            }).catch((err) => {
              this.individualView = false;
            });
          }
          else{
            this.myHome = this.homesService.homes[params.id - 1];
            this.individualView = true;
          }
        }
        else{
          this.individualView = false;
        }
      });
    }
  }
  ngOnChanges(){
    
  }

}
