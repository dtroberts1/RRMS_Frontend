import {IEmployer} from './Employer';
import {IPreviousRental} from './PreviousRental';

export interface IProspect{
    EmailAddress : string,
    FName : string,
    LName : string,
    MdInit : string,
    employers : Iterable<IEmployer>,
    previousRentals : Iterable<IPreviousRental>,
    SSN: string,
    status: ProspectStatus,
    prospectID: number,
}
enum ProspectStatus {
    approved = 1,
    declined = 2,
    pending = 3,
  }