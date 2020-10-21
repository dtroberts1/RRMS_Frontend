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

export enum TermType {
  monthToMonth = 1,
  fixedTerm = 2,
}
@Component({
  selector: 'app-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.css']
})
export class AddProspectComponent implements OnInit {
  homes : Iterable<IHome>;
  fName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);
  lName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);
  mdInit = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  ssn = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  moveInDate = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  moveOutDate = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : TermType = TermType.monthToMonth;
  employers : Array<IEmployer> = new Array<IEmployer>();
  prevRentals : Array<IPreviousRental> = new Array<IPreviousRental>();
  selectedRoomId : number;
  selectedRoomName: string = "No Room Selected";
  roomId : number = -1; // Change this!
  nickname : string;
  checked : boolean = false;
  nbrRooms : number;
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
        invalidElements.push("Email");
      }
      if (this.ssn.invalid){
        invalidElements.push("Phone Number");
      }
      if (this.email.invalid){
        invalidElements.push("Address (1)");
      }
      if (this.employers.length == 0){
        invalidElements.push("No Employers. Add Employer");
      }
      if (this.prevRentals.length == 0){
        invalidElements.push("No Previous Rentals. Add Rental");
      }
      if (invalidElements.length > 0)
      {

        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: true,
            title: "Invalid Items",
            contentSummary: "The following items are invalid",
            errorItems: invalidElements
          }
        }).afterClosed().subscribe(result => {
          resolve(false);

        });
      }else{
        resolve(true);
      }
    });
  }

  addProspect(){
    this.inputsAreValid().then(() =>{
      this.prospectService.saveProspect({
        EmailAddress : this.email.value,
        FName : this.fName.value,
        LName : this.lName.value,
        MdInit : this.mdInit.value,
        Employers : this.employers,
        PreviousRentals : this.prevRentals,
        SSN: this.ssn.value,
        Status: ProspectStatus.pending,
        PhoneNumber: this.phoneNumber.value,
        RoomId: this.selectedRoomId,
        ProspectId: -1,
        MoveInDate: this.moveInDate.value,
        MoveOutDate: this.moveOutDate.value,
        TermType: this.termTypeMap.get(this.termType.toString()),
      }).then(() => {
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "Prospect Saved",
            contentSummary: "This Prospect has been Added",
            errorItems: []
          }
          }).afterClosed().subscribe((addRooms: boolean)=> {
            this.router.navigate([`homes`]);

          });
      }).catch((err) => {
        console.log(err);
      });
    });
  }
  openLinkRoomModal(){
    this.homesService.getHomes().then((homes) => {
      this.homes = homes;
      this.dialog.open(LinkRoomModalComponent, {
        data: {
          homes : this.homes,
        }
      }).afterClosed().subscribe((selectedRoomId : number) => {
        if (selectedRoomId)
        {
          this.selectedRoomId = selectedRoomId;
          console.log("selectedRoom is " + this.selectedRoomId);
          this.roomsService.getRoom(selectedRoomId).then((room : IRoom) => {
            this.selectedRoomName = room.RoomName;
          })
          .catch((err) => {
            console.log(err);
          }); 
        }
      });
    }).catch((err) =>{
      console.log(err);
    });
  }
  addPrevRental(){
    this.dialog.open(AddPrevRentalComponent, {
      data: {}
    }).afterClosed().subscribe((prevRental : IPreviousRental) => {
      if (prevRental)
      this.prevRentals.push(prevRental);
    });
  }

  addEmployer(){
    this.dialog.open(AddEmployerComponent, {
      data: {}
    }).afterClosed().subscribe((emp : IEmployer) => {
      if (emp)
        this.employers.push(emp);
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
enum ProspectStatus {
  approved = 1,
  declined = 2,
  pending = 3,
}