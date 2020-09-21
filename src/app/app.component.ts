import { Component,OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'RRMSWebapp';
  showLoginScreen: boolean = false;
  showCreateAcctScreen: boolean = false;
  showCreateAcctEmailConfScreen: boolean = false;
  email = new FormControl('', [Validators.required, Validators.email]);

  onNotifyFromCreateAcctEmailConf(message: string): void{
    this.title = "notify received";
    this.showCreateAcctEmailConfScreen = !this.showCreateAcctEmailConfScreen;
  }
  
  onNotifyFromCreateAcct(message: string): void{
    console.log("updating state of creatacct email conf");
    console.log("before rendering, email is " + this.email.value);
    this.showCreateAcctScreen = !this.showCreateAcctScreen;
    this.showCreateAcctEmailConfScreen = !this.showCreateAcctEmailConfScreen;
  }

  onNotifyFromLogin(newmg: string): void{
    this.title = "notify received";
    this.showLoginScreen = !this.showLoginScreen;
  }

  toggleLoginScreen(): void{
    this.showLoginScreen = !this.showLoginScreen;
  }
  toggleCreateAcctScreen(): void{
    this.showCreateAcctScreen = !this.showCreateAcctScreen;
  }
  ngOnInit(){   
  }
}
