import { Component, Input, OnInit } from '@angular/core';
import {ProspectService} from '../services/prospect.service';
import{IProspect} from '../interfaces/Prospect';
import { ActivatedRoute } from '@angular/router';
import { EditProspectComponent } from './edit-prospect/edit-prospect.component';
import { MatDialog } from '@angular/material/dialog';

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
  displayedColumns: string[] = ['actions','FName', 'LName', 'MdInit', 'RoomId', 'Move-in', 'Move-out', 'EmailAddress','SSN', 'status'];
  dataSource : Array<IProspect>;
  
  @Input() prospect : IProspect;

  latitude: number;
  longitude: number;
  zoom:number;
  prospects: Iterable<IProspect>;
  constructor(
    private prospectService: ProspectService,
    public dialog: MatDialog, 
    ) { 
    this.prospectService.getProspects().then((prospects: Iterable<IProspect>) => {
      this.prospects = prospects;
      this.dataSource = Array.from(this.prospects);
    }).catch((err) => {
      console.log(err);
    });
  }

  ngOnInit(): void {
    
  }

  editProspect(prosIndex: number){
    console.log(JSON.stringify(prosIndex));
    this.dialog.open(EditProspectComponent, {
      data: {
        prospects: this.prospects,
        prospectIndex : prosIndex,
      },
      width:'65%',
      height: '65%'
    }).afterClosed().subscribe((updatedProspectList: Iterable<IProspect>) => {
      // The EditProspectComponent shouldn't return back anything.
      
      this.prospects = updatedProspectList;
      this.dataSource = Array.from(this.prospects);
      console.log("prospects has been updated to " + JSON.stringify(this.prospects));
    });
  }

}
