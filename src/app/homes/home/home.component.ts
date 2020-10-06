import { Component, Input, OnInit } from '@angular/core';
import {HomesService} from '../../services/homes.service';
import{IHome} from '../../interfaces/Homes';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private route: ActivatedRoute, private homesService: HomesService) { }

  ngOnInit(): void {
    if (this.route.queryParams != null){
      this.route.queryParams.subscribe(queryParams => {
        // do something with the query params
        console.log("queryParams: " + queryParams.id);
      });
      this.route.params.subscribe(routeParams => {
        if (routeParams.id != undefined)
        {
          this.myHome = this.homesService.getHomes()[routeParams.id - 1];
        }
      });
    }
  }

}
