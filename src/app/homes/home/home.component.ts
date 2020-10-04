import { Component, Input, OnInit } from '@angular/core';
import{IHome} from '../../interfaces/Homes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //@Input() myHome: IHome;
  //myHome: IHome;
  @Input() myHome : IHome;
  latitude: number;
  longitude: number;
  zoom:number;
  constructor() { }

  ngOnInit(): void {
    console.log("in home: " + this.myHome);
    console.log("image path is : " + this.myHome?.homeImagePath);

  }

}
