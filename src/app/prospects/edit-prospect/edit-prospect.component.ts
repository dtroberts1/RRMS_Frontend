import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogDataRRMSDialog } from 'src/app/dialog-data/dialog-data.component';
import {HomesService} from '../../services/homes.service';
import { IHome } from 'src/app/interfaces/Homes';
import { IProspect } from 'src/app/interfaces/Prospect';
import {IEmployer, SalaryType} from '../../interfaces/Employer';
import {IPreviousRental} from '../../interfaces/PreviousRental';
import {IRoom} from '../../interfaces/Rooms';
import {RoomsService} from '../../services/room.service';
import { LinkRoomModalComponent } from 'src/app/homes/room/link-room-modal/link-room-modal.component';
import { ModifyEmployerModalComponent } from 'src/app/modify-employer-modal/modify-employer-modal.component';
import { ModifyPrevRentalComponent } from 'src/app/modify-prev-rental/modify-prev-rental.component';

export enum TermType {
  monthToMonth = 1,
  fixedTerm = 2,
}
@Component({
  selector: 'app-edit-prospect',
  templateUrl: './edit-prospect.component.html',
  styleUrls: ['./edit-prospect.component.css']
})
export class EditProspectComponent {
  homeImagePath : string;
  room : IRoom;
  origSettings : IProspect;
  prospects : Iterable<IProspect>;
  prospectIndex: number;
  editFName: boolean = false;
  editLName: boolean = false;
  editMdInit: boolean = false;
  editEmail: boolean = false;
  editPhoneNumber: boolean = false;
  editMoveinDate: boolean = false;
  editMoveOutDate: boolean = false;
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
  dimension1 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  dimension2 : FormControl = new FormControl('', [Validators.pattern('[0-9]{1,3}')]);
  fNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  lNameInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{2,25}')]);
  mdInitInput : FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]{1}')]);
  emailInput : FormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneNumberInput = new FormControl('', [Validators.required, Validators.pattern(/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/)]);
  moveInDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  moveOutDateInput = new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|\[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]);
  termTypeStr: string[] = ['Month-to-Month', 'Fixed-Term'];
  termType : TermType = TermType.monthToMonth;
  termTypeMap = new Map<string, TermType>([
    ['Month-to-Month', TermType.monthToMonth],
    ['Fixed-Term', TermType.fixedTerm]
  ]);
  termTypeMapReverse = new Map<TermType, string>([
    [TermType.monthToMonth, 'Month-to-Month'],
    [TermType.fixedTerm, 'Fixed-Term']
  ]);
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
  ) {
    
    this.prospects = data.prospects;
    this.prospectIndex = data.prospectIndex;
    if (this.prospects != null)
    {
      this.setOrigSettings(this.data.prospects[this.prospectIndex]);
      this.getSettings();
      this.prospectIndex = this.prospect.RoomId;
      this.roomsService.getRoom(this.prospectIndex).then((room : IRoom) => {
        this.roomsService.getRoom(room.Id).then((room: IRoom) => {
          this.selectedRoomName = room.RoomName;
        });
    });
    }
    else
      console.log("rooms is null in view-room: " + data.home.Rooms[this.currentProspectIndex]);
    this.prospectCount = (<any[]>data.prospects).length;
  }

  setOrigSettings(prospect : IProspect)
  {
   this.origSettings = Object.assign({}, prospect);
  }
  
  closeEmpDialog(){

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
          this.selectedRoomId = selectedRoomId;
          this.roomsService.getRoom(selectedRoomId).then((room : IRoom) => {
            this.selectedRoomName = room.RoomName;
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
  openEmployerModifyModal(){

  this.dialog.open(ModifyEmployerModalComponent, {
        data: {
          employers : this.prospect.Employers,
          employerIndex : 0,
        },
        width:'60%',
        height: '55%'
      }).afterClosed().subscribe((returnedEmployerList : Iterable<IEmployer>) => {
        if (returnedEmployerList != null)
          this.prospect.Employers = returnedEmployerList;
        },
        err =>{
          console.log(err);
        });
  }
  addEmp(){

  }
  openPrevRentModifyModal(){
    this.dialog.open(ModifyPrevRentalComponent, {
      data: {
        prevRentals : this.prospect.PreviousRentals,
        prevRentalIndex : 0,
      },
      width:'60%',
      height: '55%'
    }).afterClosed().subscribe((returnedPrevRentalList : Iterable<IPreviousRental>) => {
      if (returnedPrevRentalList != null)
        this.prospect.PreviousRentals = returnedPrevRentalList;
      },
      err =>{
        console.log(err);
      });
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
      case 'moveindate': { 
        this.editMoveinDate = !this.editMoveinDate;
      } 
      break; 
      case 'moveoutdate': { 
        this.editMoveOutDate = !this.editMoveOutDate;
      }
      break;  
      case 'term': { 
        this.editTermType = !this.editTermType;
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
      case 'moveindate': { 
        if (this.moveInDateInput.valid == true)
        {
          this.prospect.MoveInDate = this.moveInDateInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      break; 
      case 'moveoutdate': { 
        if (this.moveOutDateInput.valid == true)
        {
          this.prospect.MoveOutDate = this.moveOutDateInput.value;
        }
        else{
          this.changeEditMode(editStr);
          return;
        } 
      } 
      case 'term': 
          this.prospect.TermType = this.termType;
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
    this.prospect = this.data.prospects[this.prospectIndex];
    this.fNameInput.setValue(this.prospect.FName);
    this.lNameInput.setValue(this.prospect.LName);
    this.mdInitInput.setValue(this.prospect.MdInit);
    this.emailInput.setValue(this.prospect.EmailAddress);
    this.phoneNumberInput.setValue(this.prospect.PhoneNumber);
    this.moveInDateInput.setValue(this.prospect.MoveInDate);
    this.moveOutDateInput.setValue(this.prospect.MoveOutDate);
    this.termType = this.prospect.TermType;

    /*
    this.room = this.data.home.Rooms[this.currentProspectIndex];
    this.dimension1.setValue(this.room.Dimensions.split("x")[0].toString().trim());
    this.dimension2.setValue(this.room.Dimensions.split("x")[1].toString().trim());
    this.isMaster = this.room.IsMaster;
    this.hasCloset = this.room.HasCloset;
    this.hasCeilingFan = this.room.HasCeilingFan;
    this.hasPrivateBath = this.room.HasPrivateBath;
    */
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
              }
            });
          }
          else{
            this.fieldsModified = false;
            this.fillInputsWithOriginalSettings();
            this.updateCurrentProspectIndex(next);
            this.getSettings();
          }
        });
    }
    else{
      this.updateCurrentProspectIndex(next);
      this.getSettings();
    }
  }
  updateCurrentProspectIndex(next: boolean)
  {
    if (next == true){
      this.currentProspectIndex = (this.currentProspectIndex + 1) % (<any[]>this.data.prospects).length;
    }
    else if(next == false){ // If navigating to "previous"
      this.currentProspectIndex--;
      if (this.currentProspectIndex < 0){
        this.currentProspectIndex = (<any[]>this.data.prospects).length - 1;
      }
    }
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
    /*
    this.room.Dimensions = this.origSettings.Dimensions;
    this.room.MonthlyRate = this.origSettings.MonthlyRate;
    this.room.IsMaster = this.origSettings.IsMaster;
    this.room.HasCloset = this.origSettings.HasCloset;
    this.room.HasCeilingFan = this.origSettings.HasCeilingFan;
    this.room.HasPrivateBath = this.origSettings.HasPrivateBath;
    */
  }
  saveBtnClickedUpdate(){
    this.updateProspect().then(() => {
        // Do nothing
    })
    .catch((err) => {
      console.log(err);
    })
  }

  updateProspect(){
    //TODO
    return new Promise((resolve, reject) => {
    });
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
    }).afterClosed().subscribe((deleteRoom: boolean)=> {
      /*
      if (deleteRoom == true ){
        this.roomsService.removeRoom(this.room.Id);
        this.dialogRef.close("del"); // this needs to return a null
      }
      */
    });

  }
}
