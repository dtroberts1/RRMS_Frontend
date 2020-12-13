import { Component, OnInit } from '@angular/core';
import { HomesService } from '../services/homes.service';
import {IHome} from '../interfaces/Homes';
import {ProspectService} from '../services/prospect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  homes : Iterable<IHome>;
  constructor(
    private homesService: HomesService,
    private prospectService: ProspectService,
    private router: Router,
    ) { 
    this.homesService = homesService;
    this.prospectService = prospectService;
  }

  async ngOnInit() {
    this.prospectService.getProspects();// asynchronous call
    this.homesService.getHomes()?.then((homes : Iterable<IHome>) => {
      this.homes = homes;
    });
  }
  logout(){
    console.log("logging out");
    this.router.navigate([``]);
  }
}
