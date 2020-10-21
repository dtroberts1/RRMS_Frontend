import { Component, Input, OnInit } from '@angular/core';
import {ProspectService} from '../services/prospect.service';
import{IProspect} from '../interfaces/Prospect';
import { ActivatedRoute } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.component.html',
  styleUrls: ['./prospects.component.css']
})
export class ProspectsComponent implements OnInit {
  //@Input() myHome: IHome;
  //myHome: IHome;
  displayedColumns: string[] = ['FName', 'LName', 'MdInit', 'RoomId', 'Move-in', 'Move-out', 'EmailAddress','SSN', 'status'];
  dataSource : Array<IProspect>;
  
  @Input() prospect : IProspect;

  latitude: number;
  longitude: number;
  zoom:number;
  prospects: Iterable<IProspect>;
  constructor(private prospectService: ProspectService) { 
    this.prospectService.fetchProspects();
    this.prospectService.getProspects().then((prospects: Iterable<IProspect>) => {
      this.prospects = prospects;
      this.dataSource = Array.from(this.prospects);
    }).catch((err) => {
      console.log(err);
    });
  }

  ngOnInit(): void {
  }

}
