import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { AddEmployerComponent } from '../add-employer/add-employer.component';
import {Employer} from '../../interfaces/Employer';

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


  homeID : number;
  nickname : string;
  checked : boolean = false;
  nbrRooms : number;
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog, 
    private router: Router,
    ) { }

  ngOnInit(): void {

  }
  addEmployer(){
    this.dialog.open(AddEmployerComponent, {
      data: {}
    }).afterClosed().subscribe(result => {
      console.log("In afterClosed(), employer is " + result);
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
