import { Component, OnInit } from '@angular/core';
import{IHome} from '../interfaces/Homes';
@Component({
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrls: ['./homes.component.css']
})
export class HomesComponent implements OnInit {
//  tenants : Tenants;
homes: Iterable<IHome>;
simpleArg: string;
  constructor() {
    this.simpleArg = "somearg";
   }

  ngOnInit(): void {
    this.homes = [{
      summary: "This is my house",
      addressStreet1: "47725 W 1st St",
      addressStreet2: "g",
      addressCity: "Oakridge",
      addressState: "OR",
      addressZipCode: "97463",
      averageRate: 1,
      nbrRooms: 4,
      homeImagePath: "../../assets/anotherhomepic.jpg",
      nickname: "My Beautiful home",
      tenants: [
        {
          firstName: "John",
          lastName: "Doe",
          midInit: "E"
        }
      ]
    },
    {
      summary: "This is my Second house",
      addressStreet1: "3537 Egret Dr",
      addressStreet2: "",
      addressCity: "Melbourne",
      addressState: "FL",
      addressZipCode: "32901",
      averageRate: 1,
      nbrRooms: 4,
      homeImagePath: "../../assets/secondhouse.jpg",
      nickname: "My Other Beautiful home",
      tenants: [
        {
          firstName: "John",
          lastName: "Doe",
          midInit: "E"
        }
      ]
    },
    {
      summary: "This is my Third house",
      addressStreet1: "1212 Egret Dr",
      addressStreet2: "",
      addressCity: "San Francisco",
      addressState: "CA",
      addressZipCode: "24222",
      averageRate: 1,
      nbrRooms: 4,
      homeImagePath: "../../assets/secondhouse.jpg",
      nickname: "My Other Beautiful home",
      tenants: [
        {
          firstName: "John",
          lastName: "Doe",
          midInit: "E"
        }
      ]
    },
    ]
    console.log(this.homes);
  }
}
