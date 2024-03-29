export interface IEmployer{
    Id: number;
    MgrEmailAddress : string;
    CompanyName: string;
    MgrPhoneNumber: string;
    MgrFName : string;
    MgrLName : string;
    AddressStreet1: string,
    AddressStreet2: string,
    AddressCity: string,
    AddressState: string,
    AddressZipCode: string,
    ProspectJobTitle: string,
    StartDate: Date,
    EndDate: Date,
    Current: boolean,
    SalaryType: SalaryType,
    ProspectId: number,
    HourlyRate: number,
    SalaryAmt: number,
}

export enum SalaryType {
    hourly = 1,
    annual = 2,
  }