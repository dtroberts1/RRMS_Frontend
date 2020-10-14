export interface IEmployer{
    MgrEmailAddress : string;
    MgrPhoneNumber: string;
    MgrFName : string;
    MgrLName : string;
    addressStreet1: string,
    addressStreet2: string,
    addressCity: string,
    addressState: string,
    addressZipCode: string,
    prospectJobTitle: string,
    startDate: Date,
    endDate: Date,
    current: boolean,
    salaryType: SalaryType,
    prospectID: number,
}

export enum SalaryType {
    hourly = 1,
    annual = 2,
  }