import { Component, Input, OnInit } from '@angular/core';
import {ProspectService} from '../services/prospect.service';
import {IProspect, TermType} from '../interfaces/Prospect';
import { ActivatedRoute, Router } from '@angular/router';
import { EditProspectComponent } from './edit-prospect/edit-prospect.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogDataRRMSDialog } from '../dialog-data/dialog-data.component';
import { SalaryType } from '../interfaces/Employer';
import { BlockScrollStrategy, NoopScrollStrategy } from '@angular/cdk/overlay';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

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
  modalRef: MDBModalRef;
  displayedColumns: string[] = ['FName', 'LName', 'MdInit', 'RoomId', 'Move-in', 'Move-out', 'EmailAddress','SSN', 'status'];
  dataSource : Array<IProspect>;
  selection = new SelectionModel<IProspect>(false, []);
  dateNotTimeOptions : {year: string, month: string, day: string} = {
    year: 'numeric', month: 'long', day: 'numeric'
    }
  @Input() prospect : IProspect;

  latitude: number;
  longitude: number;

  zoom:number;
  prospects: Iterable<IProspect>;
  constructor(
    private prospectService: ProspectService,
    public dialog: MatDialog, 
    private router: Router,
    private modalService: MDBModalService,

    ) { 
      if (this.prospectService != null)
      {
        if (this.prospectService.prospects == null)
        {
          console.log("this.prospectService.prospects is null");
          this.prospectService.getProspects()?.then((prospects: Iterable<IProspect>) => {
            this.prospects = prospects;
            this.dataSource = Array.from(this.prospects);
            this.dataSource.forEach((dataItem) => {
              if (dataItem.MoveInDate != null)
              dataItem.MoveInDate = new Date(dataItem.MoveInDate + 'Z');
              if (dataItem.MoveOutDate != null)
                dataItem.MoveOutDate = new Date(dataItem.MoveOutDate + 'Z');
            });
          }).catch((err) => {
            console.log(err);
          });
        }
        else{
          console.log("this.prospectService.prospects is " + JSON.stringify(this.prospectService?.prospects));
          this.prospects = this.prospectService?.prospects;
          // If prospects are already in, retrieve them
          this.dataSource = Array.from(this.prospects);
          this.dataSource.forEach((dataItem) => {
            if (dataItem.MoveInDate != null)
            dataItem.MoveInDate = new Date(dataItem.MoveInDate + 'Z');
            if (dataItem.MoveOutDate != null)
              dataItem.MoveOutDate = new Date(dataItem.MoveOutDate + 'Z');
          });
        }
      }
  }

  ngOnInit(): void {
    
  }

  goToAddProspect(){
    this.router.navigate(['./dashboard/', { outlets: { view: ['prospects','add-prospect'] } }]);
  }

  removeProspect(){
    if (this.selection != null && this.selection.selected[0] != null)
    {
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: false,
          title: "Delete - Are you sure?",
          contentSummary: "Are you sure you would like to delete this prospect?",
          errorItems: []
        }
      });
      this.modalRef.content.action.subscribe((deleteProspect: boolean)=> {
        this.modalRef.hide();
        if (deleteProspect == true ){
          this.prospectService.removeProspect(this.selection.selected[0].Id);
          this.prospects = Array.from(this.prospects).filter(prevRental => prevRental.Id != this.selection.selected[0].Id);
          this.dataSource = Array.from(this.prospects);
          this.dataSource.forEach((dataItem) => {
            if (dataItem.MoveInDate != null)
            dataItem.MoveInDate = new Date(dataItem.MoveInDate + 'Z');
            if (dataItem.MoveOutDate != null)
              dataItem.MoveOutDate = new Date(dataItem.MoveOutDate + 'Z');
          });
        }
      }),
      error => {
        console.log(error);
        this.modalRef.hide();
      };
    }
    else{
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      });
      this.modalRef.content.action.subscribe(() => {
        this.modalRef.hide();
      },
      error =>{
        console.log(error);
        this.modalRef.hide();
      });
    }
  }
  getMoveoutDate(pros : IProspect){
    if (pros.TermType == TermType.fixedTerm){
      if (pros.MoveOutDate != null){
        return pros.MoveOutDate.toLocaleString('en-US', this.dateNotTimeOptions)
      }
      else{
        return null;
      }
    }
    else{
      return "Month-to-Month"
    }
  }

  modifyProspect(isEditMode: boolean){
    if (this.selection != null && this.selection.selected[0] != null)
    {
      let matDialogConfig = new MatDialogConfig();
      matDialogConfig.data = {
        prospects: this.prospects,
        prospectIndex : this.dataSource.indexOf(this.selection.selected[0]),
        uiEditMode: isEditMode,
      };
      matDialogConfig.width = '250%';
      matDialogConfig.height = '500px';
      //matDialogConfig.scrollStrategy = new BlockScrollStrategy();
      this.modalRef = this.modalService.show(EditProspectComponent, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          prospects: this.prospects,
          currentProspectIndex : this.dataSource.indexOf(this.selection.selected[0]),
          uiEditMode: isEditMode,
        }});
        this.modalRef.content.action.subscribe(() => {
          this.modalRef.hide();
          this.prospectService.getProspects().then((prospects: Iterable<IProspect>)=>{
            this.prospects = prospects;
            this.dataSource = Array.from(this.prospects);
            this.dataSource.forEach((dataItem) => {
              if (dataItem.MoveInDate != null)
              dataItem.MoveInDate = new Date(new Date(dataItem.MoveInDate).toISOString());
              if (dataItem.MoveOutDate != null)
              dataItem.MoveOutDate = new Date(new Date(dataItem.MoveOutDate).toISOString());
              this.selection.selected[0] = null;
          })
      });
    },
    error => {
      console.log(error);
      this.modalRef.hide();
    });
    }
    else{
      this.modalRef = this.modalService.show(DialogDataRRMSDialog, {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
          inError: true,
          title: "No Row Selected",
          contentSummary: "No row has been selected. Please select a row.",
          errorItems: []
        }
      });
      this.modalRef.content.action.subscribe(() => {
        this.modalRef.hide();
      },
      error => {
        console.log(error);
        this.modalRef.hide();
      });
    }
  }

  editProspect(prosIndex: number){

  }

}
