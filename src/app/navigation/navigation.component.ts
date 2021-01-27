import { Component, OnInit } from '@angular/core';
import { HomesService } from '../services/homes.service';
import {IHome} from '../interfaces/Homes';
import {ProspectService} from '../services/prospect.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    ) { 
    this.homesService = homesService;
    this.prospectService = prospectService;
    /*this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload'; */
  }
  async ngOnChnages(){
    console.log("in nav changes");

  }

  async ngOnInit() {
    console.log("in nav init");
    this.prospectService.getProspects();// asynchronous call
    this.homesService.getHomes()?.then((homes : Iterable<IHome>) => {
      this.homes = homes;
    });
  }
  logout(){
    // Should notify parent (dashboard, which should notify parent app to set showdashboard to false)
    this.router.navigate(['']);
  }
}
