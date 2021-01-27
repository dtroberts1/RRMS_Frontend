import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import {HomesService} from '../../services/homes.service';
import {ProspectService} from '../../services/prospect.service';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
import {IEmployer, SalaryType} from '../../interfaces/Employer';
import {IPreviousRental} from '../../interfaces/PreviousRental';
import {IRoom} from '../../interfaces/Rooms';
import {RoomsService} from '../../services/room.service';
import { LinkRoomModalComponent } from 'src/app/homes/room/link-room-modal/link-room-modal.component';
import { ModifyEmployerModalComponent } from 'src/app/modify-employer-modal/modify-employer-modal.component';
import { ModifyPrevRentalComponent } from 'src/app/modify-prev-rental/modify-prev-rental.component';
import { EmployerService } from 'src/app/services/employer.service';

export enum TermType {
  monthToMonth = 1,
  fixedTerm = 2,
}
enum ProspectStatus {
  approved = 1,
  declined = 2,
  pendingLandlordDecision = 3,
  pendingLeaseSignature = 4,
  leasedSigned = 5,
  inBilling = 6,
}
interface ITermType{
  name: string,
  termType: TermType,
}
interface IStatus{
  name: string,
  statusType: ProspectStatus,
}

@Component({
  selector: 'app-edit-prospect',
  templateUrl: './edit-prospect.component.html',
  styleUrls: ['./edit-prospect.component.css']
})
export class EditProspectComponent {
  editImageSrcFName : string = '../../../assets/edit_icon.svg'
  editImageSrcLName : string = '../../../assets/edit_icon.svg'
  editImageSrcMdInit : string = '../../../assets/edit_icon.svg'
  editImageSrcEmail : string = '../../../assets/edit_icon.svg'
  editImageSrcPhone : string = '../../../assets/edit_icon.svg'
  editImageSrcSSN : string = '../../../assets/edit_icon.svg'
  editImageSrcRoom : string = '../../../assets/edit_icon.svg'
  editImageSrcEmployers : string = '../../../assets/edit_icon.svg'
  editImageSrcPrevRent : string = '../../../assets/edit_icon.svg'
  addImageSrcEmployer : string = '../../../assets/plus_sign.svg'
  addImageSrcPrevRent : string = '../../../assets/plus_sign.svg'
  delProsImageSrc : string = '../../../assets/remove_prospect_icon.svg'
  backButtonImgSrc : string = '../../../assets/left_arrow_prospect.svg'
  nextButtonImgSrc : string = '../../../assets/left_arrow_prospect.svg'
  closeIconSrc : string = '../../../assets/close_door.svg'
  dateNotTimeOptions : {year: string, month: string, day: string} = {
    year: 'numeric', month: 'long', day: 'numeric'
    }
  selectedStatus : ProspectStatus;
  homeImagePath : string;
  room : IRoom;
  uiEditMode : boolean;
  origSettings : IProspect;
  prospects : Iterable<IProspect>;
  editFName: boolean = false;
  editLName: boolean = false;
  editMdInit: boolean = false;
  editEmail: boolean = false;
  editPhoneNumber: boolean = false;
  editMoveinDate: boolean = false;
  editMoveOutDate: boolean = false;
  editSSN: boolean = false;
  editTermType: boolean = false;
  editDimension2: boolean = false;
  editMaster: boolean = false;
  editFan: boolean = false;
  editBathroom: boolean = false;
  editCloset: boolean = false;
  fieldsModified: boolean = false;
  currentProspectIndex: number = 0;
  prospectCount: number = 0;
  homes: Iterable<IHome>;
  prospect : IProspect;
  selectedRoomId : number;
  fNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  lNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  mdInitInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  emailInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneNumberInput = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  moveInDateInput = new FormControl('', [Validators.required]);//, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  moveOutDateInput = new FormControl('', [Validators.required]);//, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  ssnInput = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/)]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : string;
  termList:Iterable<ITermType> = [
    { "name": "Month-to-Month", termType: TermType.monthToMonth},
    { "name": "Fixed-Term", termType: TermType.fixedTerm}
]
statusList:Iterable<IStatus> = [
  { "name": "Approved", statusType : ProspectStatus.approved},
  { "name": "Declined", statusType : ProspectStatus.declined},
  { "name": "Pending", statusType : ProspectStatus.pendingLandlordDecision}
]
  termTypeMap = new Map<string, TermType>([
    ['Month-to-Month', TermType.monthToMonth],
    ['Fixed-Term', TermType.fixedTerm]
  ]);
  termTypeMapReverse = new Map<TermType, string>([
    [TermType.monthToMonth, 'Month-to-Month'],
    [TermType.fixedTerm, 'Fixed-Term']
  ]);
  dateObserverablesEnabled: boolean = true;
  isMaster : boolean;
  hasCloset : boolean;
  hasCeilingFan : boolean;
  hasPrivateBath : boolean;
  selectedRoomName : string = 'No Room Selected';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  @Inject(MAT_DIALOG_DATA) public rooms: Iterable<IRoom>,
  public dialogRef: MatDialogRef<EditProspectComponent>,
  private roomsService: RoomsService,
  public dialog: MatDialog, 
  private homesService: HomesService,
  private prospectService: ProspectService,
  private employerService: EmployerService,
  ) {
    
    this.prospects = data.prospects;
    this.currentProspectIndex = data.prospectIndex;
    this.uiEditMode = data.uiEditMode;
    if (this.prospects != null)
    {
      this.setOrigSettings(this.data.prospects[this.currentProspectIndex]);
      this.getSettings();
      this.roomsService.getRoom(this.prospect.RoomId).then((room : IRoom) => {
        if (room != null)
          this.selectedRoomName = room.RoomName;
        else
          this.selectedRoomName = "";
    });
      this.dateObserverablesEnabled = true;
    }
    this.prospectCount = (<any[]>data.prospects)?.length;
    this.enableDateObservables();
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => {
      this.closeProspectDialog();
    })
  }

  enableDateObservables(){

    this.moveInDateInput.valueChanges.subscribe((val : Date) => {
      if (this.dateObserverablesEnabled == true){
        if (val != null)
        {
         console.log("in valueChanges()");
          this.prospect.MoveInDate = new Date(val.toISOString());
          this.fieldsModified = true;
        }
        else{
          return;
        } 
      }
    });
    this.moveOutDateInput.valueChanges.subscribe((val : Date) => {
      if (this.dateObserverablesEnabled == true){
        if (val != null)
        {
          //console.log("this.moveInDateInput is valid. value is " + JSON.stringify((val.getUTCDate())))
          this.prospect.MoveOutDate = new Date(val.toISOString());
          this.fieldsModified = true;
        }
        else{
          return;
        } 
    }
    });
  }

  setOrigSettings(prospect : IProspect)
  {
   this.origSettings = Object.assign({}, prospect);
  }
  
  closeProspectDialog(){
      if (this.fieldsModified == true){
        this.dialog.open(DialogDataRRMSDialog, {
          data: {
            inError: false,
            title: "Unsaved Changes",
            contentSummary: "Warning. There are unsaved Changes. Would you still like to proceed, or save?",
            errorItems: []
          }
          }).afterClosed().subscribe((choosesSave: boolean)=> {
            if (choosesSave == true){
              console.log("chooses save");
              this.updateProspect().then((saveSuccess: boolean) => {
                this.dialogRef.close(this.prospects);
              });
            }
            else{
              console.log("does not choose save");
              this.dialogRef.close(null);
            }
          });
        }
        else{
          this.dialogRef.close(null);
        }
  }  
  openLinkRoomModal(){
    this.homesService.getHomes().then((homes) => {
      this.homes = homes;
      this.dialog.open(LinkRoomModalComponent, {
        data: {
          homes : this.homes,
        }
      }).afterClosed().subscribe((selectedRoomId : number) => {
        if (selectedRoomId)
        {
          this.prospect.RoomId = selectedRoomId;
          this.roomsService.getRoom(selectedRoomId).then((room : IRoom) => {
            this.selectedRoomName = room.RoomName;
            this.fieldsModified = true;
          })
          .catch((err) => {
            console.log(err);
          }); 
        }
      });
    }).catch((err) =>{
      console.log(err);
    });
  }
  // If add is true, it will open the modal in 'Add Employer' mode
  openEmployerModifyModal(add: boolean){
    if (this.prospect != null)
    {
      if (add == true){
        this.dialog.open(ModifyEmployerModalComponent, {
          data: {
            addMode: true,
            prospectId: this.prospect.Id,
          },
          width: '250%',
          height: '550px',
        }).afterClosed().subscribe((returnedEmployer : IEmployer) => {
          // Push the newly added employer to the list
          if (returnedEmployer != null)
            (<IEmployer[]>(this.prospect.Employers)).push(returnedEmployer);
          },
          err =>{
            console.log(err);
          });
      }
      else if(add == false){
        let prosId = this.prospect.Id;
        this.dialog.open(ModifyEmployerModalComponent, {
          data: {
            employers : this.prospect.Employers,
            employerIndex : 0,
            addMode: false,
          },
          width: '250%',
          height: '550px',
        }).afterClosed().subscribe((returnedEmployerList : Iterable<IEmployer>) => {
          this.employerService.getProspectEmployers(prosId).then((employers: Iterable<IEmployer>) => {
            console.log("returned employers is " + JSON.stringify(employers))
            this.prospect.Employers = employers; // Get prospect with updated employers
          });
        });
      }
    }
  }
  addEmp(){

  }
  hasEmployers(){
    if (this.prospect != null)
    {
      if ((<any[]>this.prospect.Employers)?.length > 0)
        return true;
      else
        return false;
    }
    else{
      return false;
    }
  }

  getCmpyNameSrc(emp : IEmployer){
    let retVal = null;
    if (emp != null)
    retVal = emp.CompanyName.replace(/\s/g, "");
    return retVal;
  }

  hasPrevRentals(){
    if ((<any[]>this.prospect.PreviousRentals)?.length > 0)
      return true;
    else
      return false;
  }
  openPrevRentModifyModal(add: boolean){
    if (add == true){
      this.dialog.open(ModifyPrevRentalComponent, {
        data: {
          addMode: true,
          prospectId: this.prospect.Id,
        },
        width: '60%',
        height: '550px',
      }).afterClosed().subscribe((returnedPrevRental : IPreviousRental) => {
        // Push the newly added employer to the list
        if (returnedPrevRental != null)
          (<IPreviousRental[]>(this.prospect.PreviousRentals)).push(returnedPrevRental);
        },
        err =>{
          console.log(err);
        });
    }
    else if(add == false){
      this.dialog.open(ModifyPrevRentalComponent, {
        data: {
          addMode: false,
          prevRentals : this.prospect.PreviousRentals,
          prevRentalIndex : 0,
        },
        width: '60%',
        height: '550px',
      }).afterClosed().subscribe((returnedPrevRentalList : Iterable<IPreviousRental>) => {
        if (returnedPrevRentalList != null)
          this.prospect.PreviousRentals = returnedPrevRentalList;
        },
        err =>{
          console.log(err);
        });
    }
  }
  canDispNextAndPrev(){
    if (this.prospectCount > 1)
      return true;
    return false;
  }
  changeEditMode(str:string){
    switch(str) { 
      case 'fname': { 
        this.editFName = !this.editFName;
         break; 
      } 
      case 'lname': { 
        this.editLName = !this.editLName;
         break; 
      } 
      case 'mdinit': { 
        this.editMdInit = !this.editMdInit;
         break; 
      } 
      case 'email': { 
        this.editEmail = !this.editEmail;
      } 
      break; 
      case 'phone': { 
        this.editPhoneNumber = !this.editPhoneNumber;
      } 
      break;  
      case 'ssn': { 
        this.editSSN = !this.editSSN;
      }
      break; 
      default: { 
         //statements; 
         break; 
      } 
   } 
  }
  updateInput(editStr : string){
    switch(editStr) { 
      case 'fname': { 
        if (this.fNameInput.valid == true)
        {
          this.prospect.FName = this.fNameInput.value;
          
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'lname': { 
        if (this.lNameInput.valid == true)
        {
          this.prospect.LName = this.lNameInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'mdinit': { 
        if (this.mdInitInput.valid == true)
        {
          this.prospect.MdInit = this.mdInitInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'email': { 
        if (this.emailInput.valid == true)
        {
          this.prospect.EmailAddress = this.emailInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'phone': { 
        if (this.phoneNumberInput.valid == true)
        {
          this.prospect.PhoneNumber = this.phoneNumberInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'ssn': { 
        if (this.ssnInput.valid == true)
        {
          this.prospect.SSN = this.ssnInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      default: { 
         //statements; 
         break; 
      } 
    }
    this.changeEditMode(editStr);
    this.fieldsModified = true;
  }
  onFileComplete(data: any) {
    //this.homeImagePath = data.link;
  }

  getSettings(){
    this.prospect = this.data.prospects[this.currentProspectIndex];
    if (this.prospect != null){
      this.fNameInput.setValue(this.prospect.FName);
      this.lNameInput.setValue(this.prospect.LName);
      this.mdInitInput.setValue(this.prospect.MdInit);
      this.emailInput.setValue(this.prospect.EmailAddress);
      this.phoneNumberInput.setValue(this.prospect.PhoneNumber);
      this.moveInDateInput.setValue(new Date(this.prospect.MoveInDate.toISOString()));
      if (this.prospect.MoveOutDate != null){
        this.moveOutDateInput.setValue(new Date(this.prospect.MoveOutDate.toISOString()));
      }
      this.ssnInput.setValue(this.prospect.SSN);
      this.selectedStatus = this.prospect.Status;
      this.roomsService.getRoom(this.prospect.RoomId).then((room : IRoom) => {
        if (room != null)
          this.selectedRoomName = room.RoomName;
        else
          this.selectedRoomName = "";
      })
      this.setTermType();
    }
  }

  setTermType(){
    if (this.prospect.TermType == TermType.fixedTerm)
      this.termType = this.termList[1].name;
    else if (this.prospect.TermType == TermType.monthToMonth)
      this.termType = this.termList[0].name;
  }

  goToNextOrPrevRm(next: boolean){
    if (this.fieldsModified == true){
      this.dialog.open(DialogDataRRMSDialog, {
        data: {
          inError: false,
          title: "Unsaved Changes",
          contentSummary: "Warning. There are unsaved Changes. Would you still like to proceed, or save?",
          errorItems: []
        }
        }).afterClosed().subscribe((choosesSave: boolean)=> {
          if (choosesSave == true){
            this.updateProspect().then((saveSuccess: boolean) => {
              if (saveSuccess == true){
                this.fieldsModified = false;
                this.updateCurrentProspectIndex(next);
                this.getSettings();
                this.dateObserverablesEnabled = true;
              }
            });
          }
          else{
            this.fieldsModified = false;
            this.fillInputsWithOriginalSettings();
            this.updateCurrentProspectIndex(next);
            this.getSettings();
            this.dateObserverablesEnabled = true;
          }
        });
    }
    else{
      this.updateCurrentProspectIndex(next);
      this.getSettings();
      this.dateObserverablesEnabled = true;
    }
  }
  updateCurrentProspectIndex(next: boolean)
  {
    if (next == true){
      this.dateObserverablesEnabled = false;
      this.currentProspectIndex = (this.currentProspectIndex + 1) % (<any[]>this.data.prospects)?.length;

    }
    else if(next == false){ // If navigating to "previous"
    this.dateObserverablesEnabled = false;
      this.currentProspectIndex--;
      if (this.currentProspectIndex < 0){
        this.currentProspectIndex = (<any[]>this.data.prospects)?.length - 1;
      }
    }
  }

  getPrevRentalTooltip(prevRental: IPreviousRental){
    return this.prospect.FName + (prevRental.Current == true ? ' lives at ' : ' lived at ') + prevRental.AddressStreet1 + ', ' + 
    prevRental.AddressCity + ', ' + prevRental.AddressState + (prevRental.Current == true ?' since ' : ' from ') +
    new Date(prevRental.StartDate).toLocaleString('en-US', this.dateNotTimeOptions) + (prevRental.Current == true ? 
      ' and still resides here.' : ' to ' + new Date(prevRental.EndDate).toLocaleString('en-US', this.dateNotTimeOptions));
  }

  getEmployerTooltip(employer: IEmployer){
    return this.prospect.FName + (employer.Current == true ? ' works at ' : ' worked at ') + employer.CompanyName + ", located at " + employer.AddressStreet1 + ', ' + 
    employer.AddressCity + ', ' + employer.AddressState + (employer.Current == true ?', since ' : ', from ') +
    new Date(employer.StartDate).toLocaleString('en-US', this.dateNotTimeOptions) + (employer.Current == true ? 
      ' and still works here.' : ' to ' + new Date(employer.EndDate).toLocaleString('en-US', this.dateNotTimeOptions));
  }

  setModified(event){
    console.log("updating modified");
    this.fieldsModified = true;
  }

  closeViewRoomDialog(){
    this.dialogRef.close(null); // this needs to return a null
  }
  fillInputsWithOriginalSettings(){
    this.prospect.FName = this.origSettings.FName;
    this.prospect.LName = this.origSettings.LName;
    this.prospect.MdInit = this.origSettings.MdInit;
    this.prospect.EmailAddress = this.origSettings.EmailAddress;
    this.prospect.PhoneNumber = this.origSettings.PhoneNumber;
    this.prospect.MoveInDate = this.origSettings.MoveInDate;
    this.prospect.MoveOutDate = this.origSettings.MoveOutDate;
    this.prospect.TermType = this.origSettings.TermType;
    this.prospect.RoomId = this.origSettings.RoomId;
    this.prospect.SSN = this.origSettings.SSN;
    this.prospect.Status = this.origSettings.Status;
  }
  saveBtnClickedUpdate(){
    this.updateProspect().then(() => {
        // Do nothing
    })
    .catch((err) => {
      console.log(err);
    })
  }

  moveDatesValid(){
    if (this.prospect == null){
      return true; // Date Checks do not apply in this case
    }
    if (this.prospect.MoveOutDate == null){
      return true; // If moveout date is null (because term Type is month-to-month), date check is valid
    }
    else if (this.prospect != null && this.prospect.MoveInDate <= this.prospect.MoveOutDate){
      return true;
    }
    else{
      // Not valid if Move out date comes before move-in date
      return false;
    }
  }

  updateProspect(){
     //TODO
     console.log("Before updating prospect is "+ JSON.stringify(this.prospect))
    if (this.moveDatesValid() == true){
        if (this.prospect != null){
          this.prospect = {
            Id : this.prospect.Id,
            EmailAddress : this.emailInput.value,
            FName : this.fNameInput.value,
            LName : this.lNameInput.value,
            MdInit : this.mdInitInput.value,
            PhoneNumber : this.phoneNumberInput.value,
            Employers : this.prospect.Employers,
            PreviousRentals : this.prospect.PreviousRentals,
            SSN: this.ssnInput.value,
            Status: this.selectedStatus,
            ProspectId: this.prospect.Id,
            RoomId: this.prospect.RoomId,
            MoveInDate: this.moveInDateInput.value,
            MoveOutDate: (this.termType == 'Fixed-Term' ? this.moveOutDateInput.value : null),
            TermType: this.termTypeMap.get(this.termType),
            LandlordId: this.prospect.LandlordId,
        }
      }
      return new Promise((resolve, reject) => {
        this.prospectService.updateProspect(this.prospect).then(() => {
          console.log("after update, prospect is " + JSON.stringify(this.prospect))
          this.prospects[this.currentProspectIndex] = this.prospect;

          this.dialog.open(DialogDataRRMSDialog, {
            data: {
              inError: false,
              title: "Prospect Saved",
              contentSummary: "This prospect has been saved",
              errorItems: []
            }
            }).afterClosed().subscribe((addRooms: boolean)=> {
              this.fieldsModified = false;
              this.prospectService.prospects = null; // This should force prospects to reload
              resolve(true);
            });
        }).catch((err) => {
          console.log(err);
          reject(false);
        });
      });
    }
    else{
      // Move in/moveout date combination is not valid
      this.dialog.open(DialogDataRRMSDialog, {
        data: {
          title: "Incorrect Dates",
          contentSummary: "Invalid Dates. Please Verify dates are correct",
        }
        }).afterClosed().subscribe((addRooms: boolean)=> {

        });
    }
  }
  getInputErrorMessage(inputField){
    
    if (inputField.hasError('required')) {
      return 'You must enter a value';
    }
    if (inputField.hasError(inputField)){
        return "Not a valid entry";
    }
  }

  deleteBtnClicked(){
    this.dialog.open(DialogDataRRMSDialog, {
      data: {
        inError: false,
        title: "Delete - Are you sure?",
        contentSummary: "Are you sure you would like to delete this prospect?",
        errorItems: []
      }
    }).afterClosed().subscribe((deleteProspect: boolean)=> {
      if (deleteProspect == true ){
        this.prospectService.removeProspect(this.prospect.Id);
        this.prospects = Array.from(this.prospects).filter(prevRental => prevRental.Id != this.prospect.Id);
        this.dialogRef.close(this.prospects); // this needs to return a null
      }
    });

  }
}
