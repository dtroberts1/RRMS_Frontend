import { Component, Input, OnInit } from '@angular/core';
import {ProspectService} from '../services/prospect.service';
import {IProspect} from '../interfaces/Prospect';
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
      if (this.prospectService != null)
      {
        if (this.prospectService.prospects == null)
        {
          this.prospectService.getProspects()?.then((prospects: Iterable<IProspect>) => {
            this.prospects = prospects;
            this.dataSource = Array.from(this.prospects);
          }).catch((err) => {
            console.log(err);
          });
        }
        else{
          this.prospects = this.prospectService?.prospects;
          // If prospects are already in, retrieve them
          this.dataSource = Array.from(this.prospects);
        }
      }
  }

  ngOnInit(): void {
    
  }

  editProspect(prosIndex: number){
    this.dialog.open(EditProspectComponent, {
      data: {
        prospects: this.prospects,
        prospectIndex : prosIndex,
      },
      width:'65%',
      height: '65%'
    }).afterClosed().subscribe((updatedProspectList: Iterable<IProspect>) => {
      // The EditProspectComponent shouldn't return back anything.
      console.log("updated list: " + JSON.stringify(updatedProspectList))
      if ((<any[]>updatedProspectList).length > 0)      
      {
        this.prospects = updatedProspectList;
        this.dataSource = Array.from(this.prospects);
      }
      else{
        this.prospects = null;
        this.dataSource = [];
      }
    });
  }

}
