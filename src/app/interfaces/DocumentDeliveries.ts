// This interface can be used to display information about a document and its corresponding (future) tenant
// It can also be used to fill in placeholders/merge tags for documents
export interface IDocumentDeliveries{
    Id : number,
    DeliveryDate : Date,
    ToAddress : string,
    LeaseDocumentId : number,
    DocumentDeclined: boolean,
}