import { Component, OnInit } from '@angular/core';
import{IHome} from '../interfaces/Homes';
import {HomesService} from '../services/homes.service';

@Component({
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrls: ['./homes.component.css']
})
export class HomesComponent implements OnInit {
//  tenants : Tenants;
homes: Iterable<IHome>;
simpleArg: string;
  constructor(private homeService: HomesService) {
    this.homes = this.homeService.getHomes(); 
    console.log("In homes component, homes is " + JSON.stringify(this.homes));
    console.log(this.homes);
    this.simpleArg = "somearg";
   }

   ngOnInit() {

  }
  getHomesCount(): number{
    let myCount;
    if (this.homes == null)
      myCount = 0;
    else{
      myCount = (<any>this?.homes).length;
    }
    console.log("homes count is " + myCount);
    return myCount;
  }
}
