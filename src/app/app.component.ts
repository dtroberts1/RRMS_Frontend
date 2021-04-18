import { Component,OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AccountService} from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  constructor(private router: Router,
    private route: ActivatedRoute,
    ){

  }
  title = 'RRMSWebapp';
  loginLogout = "Login";
  showLoginScreen: boolean = true;
  showCreateAcctScreen: boolean = false;
  showCreateAcctEmailConfScreen: boolean = false;
  showDashboard: boolean = false;
  canShowLeaseDocApprovalScrn: boolean = false;
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
      this.showCreateAcctScreen = !this.showCreateAcctScreen;
      this.showCreateAcctEmailConfScreen = !this.showCreateAcctEmailConfScreen;
    }
  }

  async onNotifyFromLogin(msgFromLogin: string): Promise<void>{
    this.showLoginScreen = !this.showLoginScreen;

    if (msgFromLogin == "loginSuccessful")
    {
      this.showDashboard = !this.showDashboard;
      this.router.navigate([`dashboard`]);
    }
    else if(msgFromLogin == "closeLoginDialog"){
      console.log("cancelling")
      this.showLoginScreen = false;

    }
  }
  toggleDashboard(): void{
    this.showDashboard = !this.showDashboard;
    console.log("showDashboard is "+ this.showDashboard);
  }
  toggleLoginScreen(): void{
    this.showLoginScreen = !this.showLoginScreen;

    if (this.showDashboard)
    { // First close dashboard if it's opened.
      // Clear Token
      localStorage.clear();
      this.showDashboard = !this.showDashboard;
      this.router.navigate([`login`]);
    }
  }
  toggleCreateAcctScreen(): void{
    this.showCreateAcctScreen = !this.showCreateAcctScreen;
  }
  ngOnInit(){   
    if (this.route.queryParams != null){
      this.route.queryParams.subscribe(queryParams => {
        console.log("queryParams is " + JSON.stringify(queryParams))
        // do something with the query params
      });
      this.route.params.subscribe(routeParams => {
        console.log("routeParam is " + JSON.stringify(routeParams))
        if (routeParams.id != undefined)
        {
          console.log("displaying ui");
          this.canShowLeaseDocApprovalScrn = true;

        }
      });
    }
  }
}
