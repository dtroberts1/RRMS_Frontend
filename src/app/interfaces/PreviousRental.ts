export interface IPreviousRental{
    Id: number,
    AddressStreet1: string,
    AddressStreet2: string,
    AddressCity: string,
    AddressState: string,
    AddressZipCode: string,
    PrevLandlordFName : string;
    PrevLandlordPhone: string,
    PrevLandlordLName : string;
    PrevLandlordEmailAddress : string;
    PrevLandlordPhoneNumber : string;
    StartDate: Date,
    EndDate: Date,
    Current: boolean,
    ProspectId: number,
}