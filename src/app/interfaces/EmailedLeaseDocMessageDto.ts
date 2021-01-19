import {IEmployer} from './Employer';
import {IPreviousRental} from './PreviousRental';

// This interface can be used to display information about a document and its corresponding (future) tenant
// It can also be used to fill in placeholders/merge tags for documents
export interface IEmailedLeaseDocMessageDto{
    Message: string,
    Subject: string,
    LeaseDocumentId: number, // optional
    EmailAddress: string,
    LocalFileData: any, // optional
    EmailBody : string,
    LName : string, // shouldn't need to be sent from frontend
    FName : string, 
    CustomFileAttachStm: any, // shouldn't need to be sent from frontend
}
