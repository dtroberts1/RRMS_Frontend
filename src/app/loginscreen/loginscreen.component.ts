import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AccountService} from '../services/account.service';

@Component({
  selector: 'login-screen',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.css'],
})
export class LoginScreenComponent implements OnInit{
    @Input() inVal: Number;
    @Output() notifyFromLogin = new EventEmitter<string>();

    email = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
    constructor (private accountService: AccountService){}

    
    async notifyParentClicked(inStr : string) {
      // Logout
      if (inStr == "closeLoginDialog"){
        this.notifyFromLogin.emit("closeLoginDialog. Don't login");
        return;
      }

      let result = await this.accountService.login({
        username : "nedfye@gmail.com", //this.email.value,
        password : "Password!1",//this.password.value,
        grant_type : "password"
      }).then((response) => {
       //if (result == 0){
        console.log("response is " + response);
        console.log("Login Successful, opening Dashboard...");
        this.notifyFromLogin.emit("loginSuccessful");
    }).catch((error) => {
      console.log("error is " + error);
      console.log("response from service is error. Invalid login");
      this.notifyFromLogin.emit("loginNotSuccessful");
    });

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
            return 'You must enter a value';
        }
        if(this.password.hasError('password')){
            return "Not a valid password";
        }
    }
  ngOnInit(){
      console.log("Rendering child");
  }
}
