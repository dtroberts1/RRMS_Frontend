import { Component, OnInit } from '@angular/core';
import { HomesService } from '../services/homes.service';
import {IHome} from '../interfaces/Homes';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  homes : Iterable<IHome>;
  constructor(private homesService: HomesService) { 
    this.homes = homesService.getHomes();
  }

  ngOnInit(): void {
  }

}
