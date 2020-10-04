import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


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
  addressStreet2 = new FormControl('', [Validators.required, Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  addressCity = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  addressState = new FormControl('', [Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  addressZipCode = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);

  constructor() { }

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
}
