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
  emailVal: string;
  products : any[];

  constructor(private service : AccountService){
  }
  ngOnInit(): void {
    if (this.email != null)
      this.emailVal = this.email.value;
  }

  okClicked(){
    this.notifyFromCreateAcctEmailConf.emit('emailConfirmationClicked');

  }
}
