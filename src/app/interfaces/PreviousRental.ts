export interface IPreviousRental{
    PrevLandlordEmailAddress : string;
    PrevLandlordPhoneNumber : string;
    PrevLandlordFName : string;
    PrevLandlordLName : string;
    AddressStreet1: string,
    AddressStreet2: string,
    AddressCity: string,
    AddressState: string,
    AddressZipCode: string,
    StartDate: Date,
    EndDate: Date,
    Current: boolean,
    ProspectId: number,
}