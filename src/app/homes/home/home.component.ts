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
  @Input() myHome : IHome;
  latitude: number;
  longitude: number;
  zoom:number;
  paramsId = -1;
  individualView: boolean = false; // If true, it will be displayed by itself in the UI view,
                           // not as a list item of "Homes"
  constructor(private route: ActivatedRoute, private homesService: HomesService) { 
    this.homesService = homesService;
  }

  ngOnInit(): void {
    if (this.route.queryParams != null){
      this.route.queryParams.subscribe(queryParams => {
        // do something with the query params
      });
      this.route.params.subscribe(params => {
        if (params.id != undefined)
        {
          this.homesService.getHomes().then((homes : Iterable<IHome>) => {
            this.myHome = homes[params.id - 1];
            this.individualView = true;
          }).catch((err) => {
            console.log("error in getHomes (home Component): " + err);
            this.individualView = false;
          });
        }
        else{
          this.individualView = false;
        }
      });
    }
  }
  ngOnChanges(){
    
  }

}
