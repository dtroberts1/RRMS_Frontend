import { Component,OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AccountService} from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'RRMSWebapp';
  loginLogout = "Login";
  showLoginScreen: boolean = false;
  showCreateAcctScreen: boolean = false;
  showCreateAcctEmailConfScreen: boolean = false;
  showDashboard: boolean = false;
  email = new FormControl('', [Validators.required, Validators.email]);

  onNotifyFromCreateAcctEmailConf(message: string): void{
    this.title = "notify received";
    this.showCreateAcctEmailConfScreen = !this.showCreateAcctEmailConfScreen;
  }
  
  onNotifyFromCreateAcct(message: string): void{
    if (message == "closeCreateAcctWindow"){
      this.showCreateAcctScreen = !this.showCreateAcctScreen;
    }
    else{
      console.log("updating state of creatacct email conf");
      console.log("before rendering, email is " + this.email.value);
      this.showCreateAcctScreen = !this.showCreateAcctScreen;
      this.showCreateAcctEmailConfScreen = !this.showCreateAcctEmailConfScreen;
    }
  }

  async onNotifyFromLogin(msgFromLogin: string): Promise<void>{
    console.log("message from login screen: " + msgFromLogin);
    this.showLoginScreen = !this.showLoginScreen;

    if (msgFromLogin == "loginSuccessful")
    {
      console.log("Login successful in app.component");
      this.showDashboard = !this.showDashboard;
    }
  }
  toggleDashboard(): void{
    this.showDashboard = !this.showDashboard;
  }
  toggleLoginScreen(): void{
    if (this.showDashboard)
    { // First close dashboard if it's opened.
      // Clear Token
      localStorage.clear();
      this.showDashboard = !this.showDashboard;

    }
    this.showLoginScreen = !this.showLoginScreen;
  }
  toggleCreateAcctScreen(): void{
    this.showCreateAcctScreen = !this.showCreateAcctScreen;
  }
  ngOnInit(){   
  }
}
