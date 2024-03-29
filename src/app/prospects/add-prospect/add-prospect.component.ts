import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { AddEmployerComponent } from '../add-employer/add-employer.component';
import {IEmployer} from '../../interfaces/Employer';
import {IPreviousRental} from '../../interfaces/PreviousRental';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import { ProspectService } from 'src/app/services/prospect.service';
import { IProspect } from 'src/app/interfaces/Prospect';
import { AddPrevRentalComponent } from '../add-prev-rental/add-prev-rental.component';
import { LinkRoomModalComponent } from 'src/app/homes/room/link-room-modal/link-room-modal.component';
import {HomesService} from '../../services/homes.service';
import {RoomsService} from '../../services/room.service';
import { IHome } from 'src/app/interfaces/Homes';
import { IRoom } from 'src/app/interfaces/Rooms';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

export enum TermType {
  monthToMonth = 1,
  fixedTerm = 2,
}
enum ProspectStatus {
  approved = 1,
  declined = 2,
  pendingLandlordDecision = 3,
  pendingLeaseSignature = 4,
  leasedSigned = 5,
  inBilling = 6,
}
@Component({
  selector: 'app-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.scss']
})
export class AddProspectComponent implements OnInit {
  homes : Iterable<IHome>;
  fName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);
  lName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);
  mdInit = new FormControl('', [Validators.pattern('[a-zA-Z]{1}')]);
  ssn = new FormControl('', [Validators.pattern(/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/^((((\(\d{3}\) ?)|(\d{3}-{1}))\d{3}-{1}\d{4})|(([0-9]){10}))$/)]);
  moveInDate = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  moveOutDate = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : TermType = null;
  employers : Array<IEmployer> = new Array<IEmployer>();
  prevRentals : Array<IPreviousRental> = new Array<IPreviousRental>();
  selectedRoomId : number;
  selectedRoomName: string = "No Room Selected";
  roomId : number = -1; // Change this!
  nickname : string;
  checked : boolean = false;
  nbrRooms : number;
  modalRef: MDBModalRef;
  termTypeMap = new Map<string, TermType>([
    ['Month-to-Month', TermType.monthToMonth],
    ['Fixed-Term', TermType.fixedTerm]
  ]);
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog, 
    private router: Router,
    private prospectService: ProspectService,
    private homesService: HomesService,
    private roomsService: RoomsService,
    private modalService: MDBModalService,

    ) { 
    }

  ngOnInit(): void {

  }

  async inputsAreValid():Promise<boolean> {
    return new Promise((resolve, reject) => {
      let invalidElements = new Array();
      if (this.fName.invalid){
        invalidElements.push("First Name");
      }
      if (this.lName.invalid){
        invalidElements.push("Last Name");
      }
      if (this.mdInit.invalid){
        invalidElements.push("Middle Initial");
      }
      if (this.ssn.invalid){
        invalidElements.push("Social Security Number (SSN)");
      }
      if (this.email.invalid){
        invalidElements.push("Email Address");
      }
      if (this.termType == null){
        invalidElements.push("Term Type");
      }
      if (this.selectedRoomName == 'No Room Selected'){
        invalidElements.push('Selected Room ("Link to Room")');
      }
      if (invalidElements.length > 0)
      {
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
            title: "Invalid Items",
            contentSummary: "The following items are invalid",
            errorItems: invalidElements
          }
        });
        this.modalRef.content.action.subscribe(() => {
          this.modalRef.hide();
          resolve(false);
        },
        error =>{
          console.log(error);
          this.modalRef.hide();
        });
      }else{
        resolve(true);
      }
    });
  }

  addProspect(){
    this.inputsAreValid().then((areValid: boolean) =>{
      if (areValid == true){
        let pros = {
          Id: -1,
          EmailAddress : this.email.value,
          FName : this.fName.value,
          LName : this.lName.value,
          MdInit : this.mdInit.value,
          Employers : this.employers,
          PreviousRentals : this.prevRentals,
          SSN: this.ssn.value,
          Status: ProspectStatus.pendingLandlordDecision,
          PhoneNumber: this.phoneNumber.value,
          RoomId: this.selectedRoomId,
          ProspectId: -1,
          MoveInDate: this.moveInDate.value,
          MoveOutDate: this.moveOutDate.value,
          TermType: this.termTypeMap.get(this.termType.toString()),
          LandlordId: -1,
        }
        
        this.prospectService.saveProspect(pros).then(() => {
          (<any[]>this.prospectService.prospects).push(pros);
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
              title: "Prospect Saved",
              contentSummary: "This prospect has been added.",
              errorItems: []
            }
            });
            this.modalRef.content.action.subscribe(() => {
              this.modalRef.hide();
              this.prospectService.prospects = null; // Clear cached prospects
              this.router.navigate(['./dashboard/', { outlets: { view: ['prospects'] } }]);
            },
            error => {
              console.log(error);
              this.modalRef.hide();
            });
        }).catch((err) => {
          console.log(err);
        });
      }
    });
  }
  openLinkRoomModal(){
    this.homesService.getHomes().then((homes) => {
      this.homes = homes;
      this.modalRef = this.modalService.show(LinkRoomModalComponent, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          homes : this.homes,
        }
      });
      this.modalRef.content.action.subscribe((selectedRoomId : number) => {
        this.modalRef.hide();
        if (selectedRoomId)
        {
          this.selectedRoomId = selectedRoomId;
          this.roomsService.getRoom(selectedRoomId).then((room : IRoom) => {
            this.selectedRoomName = room.RoomName;
          })
          .catch((err) => {
            console.log(err);
          }); 
        }
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
    }).catch((err) =>{
      console.log(err);
    });
  }
  addPrevRental(){
    this.modalRef = this.modalService.show(AddPrevRentalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: '',
      containerClass: '',
      animated: true,
      data: {}
    });
    this.modalRef.content.action.subscribe((prevRental : IPreviousRental) => {
      this.modalRef.hide();
      if (prevRental)
      this.prevRentals.push(prevRental);
    },
    error => {
      console.log(error);
      this.modalRef.hide();
    });
  }

  addEmployer(){
    this.modalRef = this.modalService.show(AddEmployerComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: '',
      containerClass: '',
      animated: true,
      data: {}
    });
    this.modalRef.content.action.subscribe((emp : IEmployer) => {
      this.modalRef.hide(); 
      if (emp)
        this.employers.push(emp);
    },
    error => {
      console.log(error);
      this.modalRef.hide(); 
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
