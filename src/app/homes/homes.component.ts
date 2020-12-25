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
  constructor(private homeService: HomesService,

    ) {}

   ngOnInit() {
     if (this.homeService.homes == null)
     {
      this.homeService.getHomes()?.then((homes : Iterable<IHome>) => {
        this.homes = homes;
      });
     }
     else{
        this.homes = this.homeService.homes;
     }

  }
  getHomesCount(): number{
    let myCount;
    if (this.homes == null)
      myCount = 0;
    else{
      myCount = (<any>this?.homes).length;
    }
    return myCount;
  }
  openSpecificHome(homeId: number){

  } 
}
