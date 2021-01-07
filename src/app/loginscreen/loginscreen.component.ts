import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {AccountService} from '../services/account.service';
import { HomesService } from '../services/homes.service';

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
    constructor (private accountService: AccountService, 
      private homesService: HomesService,
      private activeRoute: ActivatedRoute){
      
    }

    
    async notifyParentClicked(inStr : string) {
      // Logout
      if (inStr == "closeLoginDialog"){
        this.notifyFromLogin.emit("closeLoginDialog. Don't login");
        return;
      }
      let result = await this.accountService.login({
        username : "myEmail346346334@email.com", //this.email.value,// "es1@email.com",// "ssdfa2jg@email.com",//this.email.value, //"es1@email.com"
        password : 'Sky551er!N#@TG',//this.password.value,//"Sky551er!N#@TG", //this.password.value, //"Sky551er!N#@TG", //this.password.value, //'Sky551er!N#@TG'
        grant_type : "password"
      }).then((response) => {
        this.notifyFromLogin.emit("loginSuccessful");
    }).catch((error) => {
      console.log("error is " + error);
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
  }
}
