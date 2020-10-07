import {Employer} from './Employer';
import {PreviousRental} from './PreviousRental';

export interface Prospect{
    EmailAddress : string;
    FName : string;
    LName : string;
    MdInit : string;
    employers : Iterable<Employer>;
    previousRentals : Iterable<PreviousRental>;
    SSN: string;
    status: ProspectStatus,
}