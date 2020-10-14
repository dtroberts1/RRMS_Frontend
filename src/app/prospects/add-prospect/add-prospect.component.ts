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

@Component({
  selector: 'app-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.css']
})
export class AddProspectComponent implements OnInit {
  fName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);
  lName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);
  mdInit = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  ssn = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  employers : Array<IEmployer> = new Array<IEmployer>();
  prevRentals : Array<IPreviousRental> = new Array<IPreviousRental>();

  homeID : number;
  nickname : string;
  checked : boolean = false;
  nbrRooms : number;
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog, 
    private router: Router,
    private prospectService: ProspectService,
    ) { }

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
        console.log("about to send the following invalid items" + JSON.stringify(invalidElements));

        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: true,
            title: "Invalid Items",
            contentSummary: "The following items are invalid",
            errorItems: invalidElements
          }
        }).afterClosed().subscribe(result => {
          console.log("prompt has closed");
          resolve(false);

        });
      }else{
        resolve(true);
      }
    });
  }

  addProspect(){
    this.inputsAreValid().then(() =>{
      console.log("Inputs are valid. sending..");

      this.prospectService.saveProspect({
        EmailAddress : this.email.value,
        FName : this.fName.value,
        LName : this.lName.value,
        MdInit : this.mdInit.value,
        employers : this.employers,
        previousRentals : this.prevRentals,
        SSN: this.ssn.value,
        status: ProspectStatus.pending,
        prospectID: -1,
      });
    });
  }
  addPrevRental(){
    this.dialog.open(AddPrevRentalComponent, {
      data: {}
    }).afterClosed().subscribe((prevRental : IPreviousRental) => {
      console.log("In afterClosed(), employer is " + JSON.stringify(prevRental));
      if (prevRental)
      this.prevRentals.push(prevRental);
    });
  }

  addEmployer(){
    this.dialog.open(AddEmployerComponent, {
      data: {}
    }).afterClosed().subscribe((emp : IEmployer) => {
      console.log("In afterClosed(), employer is " + JSON.stringify(emp));
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