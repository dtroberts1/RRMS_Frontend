import {IEmployer} from './Employer';
import {IPreviousRental} from './PreviousRental';

export interface IProspect{
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
}
enum ProspectStatus {
    approved = 1,
    declined = 2,
    pending = 3,
  }