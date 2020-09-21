import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-create-acct-email-confscrn',
  templateUrl: './create-acct-email-confscrn.component.html',
  styleUrls: ['./create-acct-email-confscrn.component.css']
})
export class CreateAcctEmailConfscrnComponent implements OnInit {
  @Output() notifyFromCreateAcctEmailConf = new EventEmitter<string>();
  @Input() email: FormControl;
  products : any[];

  constructor(private service : AccountService){}
  okClicked(){
    console.log("create acct ok button clicked");
    this.notifyFromCreateAcctEmailConf.emit('emailConfirmationClicked');

  }

  ngOnInit(): void {
    console.log("email conf has initialized");
    console.log("Rendering email confirmation");
    console.log("email is " + this.email.valid);
    /*
    // Make an API call to send an email
    this.service.getAccounts().subscribe({
      next: products =>{
        this.products = products;
      }
    })
    */
  }

}
