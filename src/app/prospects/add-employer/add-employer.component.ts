import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import {IEmployer, SalaryType} from '../../interfaces/Employer';

@Component({
  selector: 'app-add-employer',
  templateUrl: './add-employer.component.html',
  styleUrls: ['./add-employer.component.css']
})
export class AddEmployerComponent {
  MgrFName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,30}')]);
  MgrLName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,30}')]);
  MgrEmailAddress = new FormControl('', [Validators.required, Validators.email]);
  MgrPhoneNumber = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  addressStreet1 = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2 = new FormControl('', [Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  addressCity = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  addressState = new FormControl('',[Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  addressZipCode = new FormControl('',  [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  prospectJobTitle = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\\s]{2,30}')]);
  startDate = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  endDate = new FormControl('',[Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  current: string[] = ['No', 'Yes'];
  salaryType: string[] = ['Annual', 'Hourly'];
  salType : SalaryType = SalaryType.annual;
  currentEmp : boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  public dialogRef: MatDialogRef<AddEmployerComponent>,
  public dialog: MatDialog, 

  ) {
  }
  closeEmpDialog(){
    this.dialogRef.close(null); // this needs to return a null

  }  
  getInputErrorMessage(inputField){
    
    if (inputField.hasError('required')) {
      return 'You must enter a value';
    }
    if (inputField.hasError(inputField)){
        return "Not a valid entry";
    }
    
  }
  async inputsAreValid():Promise<boolean> {
    return new Promise((resolve, reject) => {
      let invalidElements = new Array();
      if (this.MgrFName.invalid){
        invalidElements.push("First Name");
      }
      if (this.MgrLName.invalid){
        invalidElements.push("Last Name");
      }
      if (this.MgrEmailAddress.invalid){
        invalidElements.push("Email");
      }
      if (this.MgrPhoneNumber.invalid){
        invalidElements.push("Phone Number");
      }
      if (this.addressStreet1.invalid){
        invalidElements.push("Address (1)");
      }
      if (this.addressCity.invalid){
        invalidElements.push("City");
      }
      if (this.addressState.invalid){
        invalidElements.push("State");
      }
      if (this.addressZipCode.invalid){
        invalidElements.push("Zipcode");
      }
      if (this.startDate.invalid){
        invalidElements.push("Start Date");
      }
      if (this.endDate.invalid){
        invalidElements.push("End Date");
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
          resolve(false);

        });
      }else{
        resolve(true);
      }
    });
  }
  
  addEmp(){
    this.inputsAreValid().then((isValid: boolean) => {
      if (isValid == true){
        this.dialogRef.close(
          // IEmployer
          {
            MgrEmailAddress : this.MgrEmailAddress.value,
            MgrFName : this.MgrFName.value,
            MgrLName : this.MgrLName.value,
            addressStreet1: this.addressStreet1.value,
            addressStreet2: this.addressStreet2.value,
            addressCity: this.addressCity.value,
            addressState: this.addressState.value,
            addressZipCode: this.addressZipCode.value,
            prospectJobTitle: this.prospectJobTitle.value,
            startDate: this.startDate.value,
            endDate: this.startDate.value,
            current: this.currentEmp,
            salaryType: this.salType,
            prospectID: -1, // Not created yet
          }
        );
      }
    });
  }
}
