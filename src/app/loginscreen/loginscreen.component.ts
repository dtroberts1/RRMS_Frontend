import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

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

    notifyParentClicked() {
      this.notifyFromLogin.emit("loginChildBtnClicked");
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
