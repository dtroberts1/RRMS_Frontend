import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IHome } from 'src/app/interfaces/Homes';
import {HomesService} from '../../services/homes.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import {AddRoomComponent} from '../add-room/add-room.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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

  constructor(
    private homesService: HomesService, 
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.homeImagePath = '../../../assets/anotherhomepic.jpg';
    //this.router.navigate(['homes/addroom']); // Just for testing

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
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: true,
            title: "Invalid Items",
            contentSummary: "The following items are invalid",
            errorItems: invalidElements
          }
        }).afterClosed().subscribe(result => {
          if (invalidElements.length > 0){
            resolve(false);
          }
          else{
            resolve(true);
          }
        });
      }else{
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
          LandlordId : -1,
          }
          ).then((home:IHome) => {
            this.home = home;
            this.dialog.open(DialogDataRRMSDialog, {
              data: {
                inError: false,
                title: "Saved",
                contentSummary: "This home has been Saved! Would you like to proceed to add a rental room for this home?",
                errorItems: []
              }
            }).afterClosed().subscribe((addRooms: boolean)=> {
              if (addRooms == true ){
                this.router.navigate([`homes/addroom/${this.home.Id}/${this.home.Nickname}/${(<any[]>this.home.Rooms).length}`]);
              }
            });

          }).catch((err) => {
            this.dialog.open(DialogDataRRMSDialog, {
              data: {
                inError: true,
                title: "Unable to process",
                contentSummary: "We're sorry. We are unable to process",
                errorItems: []
              }
            });
          });
        }
        else{
          console.log("inputs are invalid");
        }
    });
  }
}