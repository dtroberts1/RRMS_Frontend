import {IEmployer} from './Employer';
import {IPreviousRental} from './PreviousRental';

export interface IProspect{
    Id : number,
    EmailAddress : string,
    FName : string,
    LName : string,
    MdInit : string,
    PhoneNumber : string,
    Employers : Iterable<IEmployer>,
    PreviousRentals : Iterable<IPreviousRental>,
    SSN: string,
    Status: ProspectStatus,
    ProspectId: number,
    RoomId: number,
    MoveInDate: Date,
    MoveOutDate: Date,
    TermType: TermType,
}
enum ProspectStatus {
    approved = 1,
    declined = 2,
    pendingLandlordDecision = 3,
    pendingLeaseSignature = 4,
    leasedSigned = 5,
    inBilling = 6,
  }
  export enum TermType {
    monthToMonth = 1,
    fixedTerm = 2,
  }