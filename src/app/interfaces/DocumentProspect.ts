import {IEmployer} from './Employer';
import {IPreviousRental} from './PreviousRental';

// This interface can be used to display information about a document and its corresponding (future) tenant
// It can also be used to fill in placeholders/merge tags for documents
export interface IDocumentProspectDto{
    DocumentName : string,
    EmailAddress : string,
    FName : string,
    LName : string,
    MdInit : string,
    PhoneNumber : string,
    SSN: string,
    Status: ProspectStatus,
    CompletedBackgroundCheck: boolean,
    ProspectId: number,
    DocumentId: number,
    TenantSigned: boolean,
    LandlordSigned: boolean,
    LeaseDeclined: boolean,
    HomeName: string,
    RoomName: string;
    MoveInDate: Date,
    MoveOutDate: Date,
    TermType: TermType,
    LatestDocDelivery: Date,
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