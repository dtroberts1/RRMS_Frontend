import {IEmployer} from './Employer';
import {IPreviousRental} from './PreviousRental';

// This interface can be used to display information about a document and its corresponding (future) tenant
// It can also be used to fill in placeholders/merge tags for documents
export interface IEmailedLeaseDocMessage{
    message: string,
    subject: string,
    leaseDocumentId: number, // optional
    emailAddress: string,
    localFileData: any, // optional
}