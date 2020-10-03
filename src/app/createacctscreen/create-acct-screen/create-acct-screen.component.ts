import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AccountService} from '../../services/account.service'

@Component({
  selector: 'create-acct-screen',
  templateUrl: './create-acct-screen.component.html',
  styleUrls: ['./create-acct-screen.component.css'],
})
export class CreateAcctScreenComponent implements OnInit{
    @Input() inVal: Number;
    @Input() email : FormControl;
    @Output() notifyFromCreateAcct = new EventEmitter<string>();

    constructor(private accountService: AccountService){}

    password = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
    fName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);
    lName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,}')]);

    createAccount(){
// This was working!
/*
      this.accountService.register({
        Email : this.email.value,
        Password : this.password.value,
        FName : this.fName.value,
        LName : this.lName.value,
        ConfirmPassword : this.password.value
      }).subscribe();

      this.notifyFromCreateAcct.emit("createAcct");
      */
    }

    getFNameErrorMessage(){
      if (this.fName.hasError('required')) {
        return 'You must enter a value';
      }
      if (this.fName.hasError('fName')){
          return "Not a valid name";
      }
    }
    getLNameErrorMessage(){
    if (this.lName.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.lName.hasError('lName')){
        return "Not a valid name";
    }
  }

    getEmailErrorMessage() {
      if (this.email.hasError('required')) {
        return 'You must enter a value';
      }
      if (this.email.hasError('email')){
          return "Not a valid email";
      }

    }
    getPasswordErrorMessage(){
        if (this.password.hasError('required')){
            return 'You must enter a value. Must be \
            At least 8 characters in length \
            with lowercase letters, \
            uppercase letters, \
            numbers, \
            and special characters \
            ';
        }
        if(this.password.hasError('password')){
            return "Not a valid password";
        }
    }
  ngOnInit(){
 

  }
}
