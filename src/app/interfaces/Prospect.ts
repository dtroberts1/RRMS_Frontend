import {IEmployer} from './Employer';
import {IPreviousRental} from './PreviousRental';

export interface IProspect{
    EmailAddress : string,
    FName : string,
    LName : string,
    MdInit : string,
    PhoneNumber : string,
    employers : Iterable<IEmployer>,
    previousRentals : Iterable<IPreviousRental>,
    SSN: string,
    status: ProspectStatus,
    prospectId: number,
    roomId: number,
}
enum ProspectStatus {
    approved = 1,
    declined = 2,
    pending = 3,
  }