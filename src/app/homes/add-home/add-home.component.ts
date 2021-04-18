import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IHome } from 'src/app/interfaces/Homes';
import {HomesService} from '../../services/homes.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import {AddRoomComponent} from '../add-room/add-room.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'app-add-home',
  templateUrl: './add-home.component.html',
  styleUrls: ['./add-home.component.css']
})
export class AddHomeComponent implements OnInit {
  homeImagePath : string;
  nickname = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,30}')]);
  summary = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\,\\.\\s]{2,375}')]);
  addressStreet1 = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2 = new FormControl('', [Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  addressCity = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  addressState = new FormControl('', [Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  addressZipCode = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  home: IHome; // Used only for navigating to homes/addroom
  modalRef: MDBModalRef;
  constructor(
    private homesService: HomesService, 
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private router: Router,
    private modalService: MDBModalService,
    ) {
  }

  ngOnInit(): void {
    this.homeImagePath = '../../../assets/anotherhomepic.jpg';
  }


  getInputErrorMessage(inputField){
    
    if (inputField.hasError('required')) {
      return 'You must enter a value';
    }
    if (inputField.hasError(inputField)){
        return "Not a valid entry";
    }
    
  }
  onFileComplete(data: any) {
    this.homeImagePath = data.link;
  }
  async inputsAreValid():Promise<boolean> {
    return new Promise((resolve, reject) => {
      let invalidElements = new Array();
      if (this.nickname.invalid){
        invalidElements.push("nickname");
      }
      if (this.summary.invalid){
        invalidElements.push("summary");
      }
      if (this.addressStreet1.invalid){
        invalidElements.push("addressStreet1");
      }
      if (this.addressStreet2.invalid){
        invalidElements.push("addressStreet2");
      }
      if (this.addressCity.invalid){
        invalidElements.push("addressCity");
      }
      if (this.addressState.invalid){
        invalidElements.push("addressState");
      }
      if (this.addressZipCode.invalid){
        invalidElements.push("addressZipCode");
      }
      if (invalidElements.length > 0)
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
            inError: true,
            title: "Invalid Items",
            contentSummary: "The following items are invalid",
            errorItems: invalidElements
          }
        })
        this.modalRef.content.action.subscribe(result => {
          if (invalidElements.length > 0){
            this.modalRef.hide();
            resolve(false);
          }
          else{
            this.modalRef.hide();
            resolve(true);
          }
        },
        error => {
          console.log(error);
          if (this.modalRef != null){
            this.modalRef.hide();
          }
          reject();
        });
      }else{
        if (this.modalRef != null){
          this.modalRef.hide();
        }
        resolve(true);
      }
    });
  }
  createHome(){
    this.inputsAreValid().then((res) => {
      if (res == true){
        this.homesService.createHome(
        {
          HomeImagePath : this.homeImagePath,
          Id : -1,
          Nickname : this.nickname.value,
          Summary : this.summary.value,
          AddressStreet1 : this.addressStreet1.value,
          AddressStreet2 : this.addressStreet2.value,
          AddressCity : this.addressCity.value,
          AddressState : this.addressState.value,
          AddressZipCode : this.addressZipCode.value,
          Rooms : [],
          Prospects : [],
          HomeImages: null, //TODO
          LandlordId : -1,
          }
          )?.then((home:IHome) => {
            this.home = home;
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
                title: "Saved",
                contentSummary: "This home has been Saved! Would you like to proceed to add a rental room for this home?",
                errorItems: []
              }
            })
            this.modalRef.content.action.subscribe((addRooms: boolean)=> {
              if (addRooms == true ){
                this.modalRef.hide();
                this.router.navigate(['./dashboard/', { outlets: { view: ['homes','addroom', this.home.Id, this.home.Nickname, (<any[]>this.home.Rooms).length] } }]);
              }
              else if(addRooms == false){
                this.modalRef.hide();
                this.router.navigate(['./dashboard/']);
              }
            },
            error => {
              console.log(error);
              this.modalRef.hide();
            });
          }).catch((err) => {
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
                title: "Unable to process",
                contentSummary: "We're sorry. We are unable to process. Our engineers have been notified and are working on the issue to get this resolved asap",
                errorItems: []
              }
            })
            this.modalRef.content.action.subscribe(()=> {
            },
            error => {
              console.log(error);
              this.modalRef.hide();
            });
        });
      }
        else{
        }
    });
  }
}